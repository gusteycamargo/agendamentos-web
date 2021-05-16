import React, { useState, useEffect } from "react";
import { DataGrid } from '@material-ui/data-grid';
import { withRouter } from 'react-router-dom';
import api from '../../../services/api';
import Swal from 'sweetalert2';
import dateFnsFormat from 'date-fns/format';
import withReactContent from 'sweetalert2-react-content'
import moment from "moment"
import NavBar from "../../../components/NavBar";
import ModalViewSchedule from "../../../components/ModalViewSchedule";
import { Button, makeStyles, Grid, FormControl, InputLabel, MenuItem, Select, Typography, Modal, Backdrop, Fade } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {GRID_DEFAULT_LOCALE_TEXT as localeText} from "../../../utils/localeTextGrid"

const columns = [
    {
        field: 'dateInitialFinal',
        headerName: 'Data | Início e fim',
        sortable: false,
        width: 235,
        valueGetter: (params) => `${moment(params.getValue('date')).format('DD/MM/YYYY') || ''} ${params.getValue('initial') || ''}-${params.getValue('final') || ''}`,
    },
    { field: 'requesting_user.fullname', width: 200, headerName: 'Solicitante', valueGetter: (params) => `${params.getValue('requesting_user').fullname || ''}`},
    { field: 'registration_user.fullname', width: 200, headerName: 'Cadastrador', valueGetter: (params) => `${params.getValue('registration_user').fullname || ''}`},
    { field: 'place.name', headerName: 'Sala', valueGetter: (params) => `${params.getValue('place').name || ''}`} ,
    { 
        field: 'equipaments.name', 
        headerName: 'Equipamentos', 
        width: 200, 
        valueGetter: (params) => {
            let names = ''
            for (const equi of params.getValue('equipaments')) {
                if(!names) names = equi.name
                else names = names+', '+equi.name
            }
            return names
        }
          
    },
    { field: 'category.description', headerName: 'Ano (curso)', valueGetter: (params) => `${params.getValue('category').description || ''}` },
    { field: 'course.name', headerName: 'Curso', valueGetter: (params) => `${params.getValue('course').name || ''}` },
    { field: 'status', headerName: 'Status' },
    { field: 'comments', headerName: 'Observações' }
];

function ViewSchedule() {
    const classes = useStyles();
    const MySwal = withReactContent(Swal);
    const FORMAT = 'yyyy-MM-dd';
    
    const [date, setDate] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [period, setPeriod] = useState('');
    const [changeOrder, setChangeOrder] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [scheduleSelected, setScheduleSelected] = useState({})

    function showMenu(x) {
        if (x.matches) { // If media query matches
            if(!changeOrder) setChangeOrder(true)
        }
        else {
            if(changeOrder) setChangeOrder(false)
        }
    }
    
    const x = window.matchMedia("(max-width: 700px)")
    showMenu(x) // Call listener function at run time
    x.addListener(showMenu) // Attach listener function on state changes

    useEffect(() => {
        async function retrieveSchedules() {
            setIsLoading(true);
            await api.get("/filter", {
                headers: { 
                    period: '',
                    date_a: dateFnsFormat(new Date(), FORMAT), 
                },
            })
            .then(function (response) {
                setSchedules(response.data);
            })
            .catch(function (error) {
                console.log(error)
            });
            setIsLoading(false);
        }

        retrieveSchedules();
        setPeriods([{ period: "Manhã"}, { period: "Tarde"}, { period: "Noite"}]);
    }, []);

    async function filter() {
        if(!date) { MySwal.fire('Data não preenchida', 'O campo data deve ser preenchido!', 'error'); return }     
        if(!period) { MySwal.fire('Turno não preenchido', 'O campo turno deve ser preenchido!', 'error'); return }     
        let manha = ""

        setIsLoading(true);
        if(period === "Manhã") manha = "Manha";
        await api.get("/filter", {
            headers: { 
                period: manha ? manha : period,
                date_a: moment(date).format('yyyy-MM-DD'), 
            },
        })
        .then(function (response) {
            manha = ""
            const schedulesReceived = response.data.filter((elem) => {
                return elem.status === 'Confirmado';
            });

            setSchedules(schedulesReceived);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar filtrar as informações, tente novamente!', 'error');
        })
        .finally(() => setIsLoading(false))
    }

    return (<>
        <NavBar/>

        {scheduleSelected && (
            <ModalViewSchedule open={open} onClose={() => setOpen(false)} schedule={scheduleSelected}/>
        )}

        <div className={classes.main}>
            <div className={classes.root}>
                <Grid container  spacing={2}>
                    <Grid item xs={12}>
                        <Typography >Filtrar</Typography>
                    </Grid>
                    <Grid item xs={changeOrder ? 12 : 4}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <KeyboardDatePicker
                                    margin="none"
                                    inputVariant="outlined"
                                    label="Data"
                                    format="dd/MM/yyyy"
                                    value={date}
                                    onChange={setDate}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                }}
                                />
                            </FormControl>
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={changeOrder ? 12 : 4}>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="turno">Turno</InputLabel>
                            <Select
                                labelId="turno"
                                id="turno-select"
                                value={period}
                                className={classes.w100}
                                onChange={e => setPeriod(e.target.value)}
                                label="Turno"
                                required
                            >
                                {periods.map(period => (
                                    <MenuItem value={period.period}>{period.period}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={changeOrder ? 12 : 4}>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <Button onClick={filter} className={classes.buttons} variant="contained" color="primary">
                                Filtrar
                            </Button>
                        </FormControl>
                    </Grid>
                </Grid>
            </div>
            <DataGrid onRowClick={({row}) => {setScheduleSelected(row); setOpen(true)}} className={classes.table} loading={isLoading} pageSize={5} localeText={localeText} autoHeight rows={schedules} columns={columns}/>
        </div>
    </>);
}

const useStyles = makeStyles((theme) => ({
    main: {
        padding: 25
    },
    table: {
        cursor: 'pointer'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none'
    },
    paper: {
        backgroundColor: '#424242',
        // border: '2px solid #000',
        borderRadius: 10,
        outline: 'none',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    edit: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35
    },
    root: {
      flexGrow: 1,
      marginTop: 10,
      marginBottom: 20
    },
    w100: {
        width: '100%',
    },
    formControl: {
        minWidth: 120,
        width: '100%',
    },
    buttons: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 14,
        paddingRight: 14,
        backgroundColor: "#042963"
      },
}));

export default withRouter(ViewSchedule)