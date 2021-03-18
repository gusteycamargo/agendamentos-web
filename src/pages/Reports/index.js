import React, { useState, useEffect } from "react";
import { withRouter } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import moment from "moment"
import NavBar from "../../components/NavBar";
import { Button, makeStyles, Grid, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography } from "@material-ui/core";
import { MuiPickersUtilsProvider, KeyboardDatePicker, } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Chart } from "react-google-charts";
import WindowSizeListener from 'react-window-size-listener';
import { useSelector } from "react-redux";

function Reports({ history }) {
    const classes = useStyles();

    const MySwal = withReactContent(Swal);
    
    const [datea, setDatea] = useState();
    const [dateb, setDateb] = useState();
    const [dataChart, setDataChart] = useState([]);
    const [height, setHeight] = useState(500);
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [types, setTypes] = useState([]);
    const [typeChart, setTypeChart] = useState([]);
    const [firstLook, setFirstLook] = useState(true);
    const [filterData, setFilterData] = useState(false);
    const [changeOrder, setChangeOrder] = useState(false)
    const userLogged = useSelector(state => state.userLogged.userLogged);

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
        async function filter() {            
            await api.get("/reports", {
                headers: {
                    date_a: moment(datea).format('yyyy-MM-DD'),
                    date_b: moment(dateb).format('yyyy-MM-DD'),
                    type_chart: typeChart
                }
            })
            .then(function (response) {
                setDataChart(response.data);
                setIsLoading(false);
            })
            .catch(function (error) {
                console.log(error)
                MySwal.fire('Oops...', 'Houve um tentar visualizar as informações, tente novamente!', 'error');
            });
        }
        
        if(!firstLook) filter();

        setTypes([{ name: "Ano (Curso)", type_chart: "category"}, 
                  { name: "Curso", type_chart: "course"}, 
                  { name: "Equipamento", type_chart: "equipament"},
                  { name: "Sala", type_chart: "place"},
                  { name: "Usuários", type_chart: "requesting_user"}]);
        setFilterData(false);
    }, [filterData]);    

    useEffect(() => {        
        if(userLogged.function === 'adm') {
            setShow(true);
        }
        else {
            history.push("/schedule/new");
        }
    }, [history, userLogged]);

    async function onFilter() {
        setIsLoading(true);
        setFilterData(true);
        setFirstLook(false);
    }

    return (<>
        <NavBar/>
        {show && (
            <div className={classes.main}>
                <div className={classes.root}>
                    <Grid container  spacing={2}>
                        <Grid item xs={12}>
                            <Typography >Filtrar</Typography>
                        </Grid>
                        <Grid item xs={changeOrder ? 12 : 3}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <KeyboardDatePicker
                                        margin="none"
                                        inputVariant="outlined"
                                        label="Data"
                                        format="dd/MM/yyyy"
                                        value={datea}
                                        onChange={setDatea}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </FormControl>
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={changeOrder ? 12 : 3}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <KeyboardDatePicker
                                        margin="none"
                                        inputVariant="outlined"
                                        label="Data"
                                        format="dd/MM/yyyy"
                                        value={dateb}
                                        onChange={setDateb}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </FormControl>
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={changeOrder ? 12 : 3}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="turno">Turno</InputLabel>
                                <Select
                                    labelId="turno"
                                    id="turno-select"
                                    value={typeChart}
                                    className={classes.w100}
                                    onChange={e => setTypeChart(e.target.value)}
                                    label="Turno"
                                    required
                                >
                                    {types.map(type => (
                                        <MenuItem value={type.type_chart}>{type.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={changeOrder ? 12 : 3}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <Button onClick={onFilter} className={classes.buttons} variant="contained" color="primary">
                                    Filtrar
                                    {isLoading && <CircularProgress size={18} style={{ marginLeft: 10 }} color="#FFF" />}
                                </Button>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <WindowSizeListener onResize={windowSize => {
                        setHeight(windowSize.windowHeight-100);
                        }}/>
                    {(firstLook) ? (
                        <p>Selecione o tipo de gráfico desejado</p>
                    ) : (
                        <Chart
                            // width={width}
                            height={height}
                            chartType="ColumnChart"
                            loader={<div>Carregando gráfico <CircularProgress size={18} style={{ marginLeft: 10 }} color="#FFF" /></div>}
                            data={dataChart}
                            options={{
                                title: 'Utilizações em agendamentos',
                                hAxis: {
                                    title: 'Nomes',
                                    minValue: 0,
                                },
                                vAxis: {
                                    title: 'Total de utilizações',
                                },
                            }}
                            legendToggle
                            style={{ marginTop: 25 }}
                        />
                    )}
                </div>
            </div>
        )}
    </>);
}

const useStyles = makeStyles((theme) => ({
    main: {
        padding: 25
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

export default withRouter(Reports)