import React, { useState, useEffect } from "react";
import { DataGrid } from '@material-ui/data-grid';
import { withRouter } from 'react-router-dom';
import api from '../../../services/api';
import Swal from 'sweetalert2';
import dateFnsFormat from 'date-fns/format';
import { formatDate } from '../../../utils/formatDate';
import withReactContent from 'sweetalert2-react-content'
import FormSchedule from '../../../components/FormSchedule';
import Bounce from 'react-activity/lib/Bounce';
import 'react-activity/lib/Bounce/Bounce.css';
import 'react-activity/lib/Spinner/Spinner.css';
import moment from "moment"
import NavBar from "../../../components/NavBar";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@material-ui/core";
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const columns = (setSchedule, setEdit) => [
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
            const onClick = () => {
                setSchedule(params.row)
                setEdit(true)
            };
        
            return <Button onClick={onClick}>Editar</Button>;
        }
    }
];

function EditSchedule() {
    const classes = useStyles();
    const MySwal = withReactContent(Swal);
    const FORMAT = 'yyyy-MM-dd';
    
    const [date, setDate] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [period, setPeriod] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [schedule, setSchedule] = useState('');
    const [edit, setEdit] = useState(false);

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
    }, [edit]);

    async function filter() {
        if(!date) { MySwal.fire('Data não preenchida', 'O campo data deve ser preenchido!', 'error'); return }     
        if(!period) { MySwal.fire('Turno não preenchido', 'O campo turno deve ser preenchido!', 'error'); return }     

        setIsLoading(true);
        if(period === "Manhã") {
            period = "Manha";
        }
        await api.get("/filter", {
            headers: { 
                period: period,
                date_a: moment(date).format('yyyy-MM-DD'), 
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
            MySwal.fire('Oops...', 'Houve um tentar filtrar as informações, tente novamente!', 'error');
        });
        setIsLoading(false);
    }


    async function editSchedules(id, data) {
        await api.put(`/schedules/${id}`, data)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Agendamento editado com sucesso', 'success');
            setEdit(false);
        })
        .catch(function (error) {
            console.log(error)
            if(error?.response?.data?.error) {
                MySwal.fire('Oops...', error.response.data.error, 'error')
            }
            else {
                MySwal.fire('Oops...', 'Houve um tentar visualizar as informações, tente novamente!', 'error');
            }
        });
    }

    useEffect(() => {
        console.log(schedule);
    }, [schedule])

    function defineEdit(schedule) {
        setSchedule(schedule);
        setEdit(true);
    }

    function returnToTable() {
        setEdit(false);
    }


    return (<>
        <NavBar/>
        <div className={classes.main}>
            {edit ? (<>
                <div className={classes.edit}>
                    <FormSchedule onSubmit={editSchedules} schedule={schedule} showBack back={returnToTable}></FormSchedule>
                </div>
            </>) : (<>
                <div className={classes.root}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography >Filtrar</Typography>
                        </Grid>
                        <Grid item xs={4}>
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
                        <Grid item xs={4}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="sala">Sala</InputLabel>
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
                        <Grid item xs={4}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <Button onClick={filter} className={classes.buttons} variant="contained" color="primary">
                                    Filtrar
                                </Button>
                            </FormControl>
                        </Grid>
                    </Grid>
                </div>
                <DataGrid loading={isLoading} autoHeight rows={schedules} columns={columns(setSchedule, setEdit)}/>
            </>)}
        </div>
    </>);
}

const useStyles = makeStyles((theme) => ({
    main: {
        padding: 25
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
    center: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    formControl: {
        minWidth: 120,
        width: '100%',
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    buttons: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 14,
        paddingRight: 14,
        backgroundColor: "#042963"
      },
}));

export default withRouter(EditSchedule)