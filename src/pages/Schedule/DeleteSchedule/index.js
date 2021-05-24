import React, { useState, useEffect } from "react";
import { DataGrid, useGridApiRef } from '@material-ui/data-grid';
import { withRouter } from 'react-router-dom';
import api from '../../../services/api';
import Swal from 'sweetalert2';
import dateFnsFormat from 'date-fns/format';
import withReactContent from 'sweetalert2-react-content'
import moment from "moment"
import NavBar from "../../../components/NavBar";
import { makeStyles } from '@material-ui/core/styles';
import {GRID_DEFAULT_LOCALE_TEXT as localeText} from "../../../utils/localeTextGrid"
import { Button, Grid, FormControl, InputLabel, MenuItem, Select, Typography } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ModalViewSchedule from "../../../components/ModalViewSchedule";

const columns = (confirm) => [
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
    { field: 'comments', headerName: 'Observações' },
    {
        field: "",
        headerName: "Ação",
        disableClickEventBubbling: true,
        renderCell: (params) => {
            return <Button onClick={() => confirm(params.row)}>Excluir</Button>;
        }
    }
];

function DeleteSchedule() {
    const classes = useStyles();
    const MySwal = withReactContent(Swal);
    const FORMAT = 'yyyy-MM-dd';
    const apiRef = useGridApiRef(null);

    const [date, setDate] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [period, setPeriod] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [changeOrder, setChangeOrder] = useState(false)
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
            let dateFilter, periodFilter;
            if(date && period) {
                if(period.period === "Manhã") {
                    period.period = "Manha";
                }

                dateFilter = dateFnsFormat(date, FORMAT);
                periodFilter = period.period;
            }
            else {
                dateFilter = dateFnsFormat(new Date(), FORMAT);
                periodFilter = '';
            }

            await api.get("/filter", {
                headers: { 
                    period: periodFilter,
                    date_a: dateFilter, 
                },
            })
            .then(function (response) {
                const schedulesReceived = response.data.filter((elem) => {
                    return elem.status === 'Confirmado';
                });
                setSchedules(schedulesReceived);
            })
            .catch(function (error) {
                console.log(error)
            });
            setIsLoading(false);
        }

        retrieveSchedules();
        setPeriods([{ period: "Manhã"}, { period: "Tarde"}, { period: "Noite"}]);
    }, [deleted]);

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
            setTimeout(() => {
                setSchedules(schedulesReceived);
            }, 1000);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar filtrar as informações, tente novamente!', 'error');
        })
        .finally(() => setIsLoading(false))
    }

    async function deleteSchedules(id) {
        setIsLoading(true);
        await api.delete(`/schedules/${id}`)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Agendamento deletado com sucesso', 'success');
            setDeleted(true);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar visualizar as informações, tente novamente!', 'error');
        });
        setIsLoading(false);
    }

    function confirmDelete(schedule) {
        MySwal.fire({
            title: 'Tem certeza?',
            text: "Não há como desfazer essa ação!!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sim, exclua!'
          }).then((result) => {
            if (result.value) {
                deleteSchedules(schedule.id);
                setDeleted(false);
            }
        });     
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
            <DataGrid onRowClick={({row}) => {setScheduleSelected(row); setOpen(true)}} className={classes.table} loading={isLoading} autoHeight rows={schedules} pageSize={5} localeText={localeText} columns={columns(confirmDelete)} apiRef={apiRef}/>
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

export default withRouter(DeleteSchedule)