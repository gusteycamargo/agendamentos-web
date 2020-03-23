import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../components/Index";
import api from '../../services/api';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Spinner from 'react-activity/lib/Spinner';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import dateFnsFormat from 'date-fns/format';
import { Combobox } from 'react-widgets'
import { parseDate } from '../../utils/parseDate';
import { formatDate } from '../../utils/formatDate';
import { Chart } from "react-google-charts";
import WindowSizeListener from 'react-window-size-listener'
import 'react-activity/lib/Spinner/Spinner.css';
import 'react-day-picker/lib/style.css';
import 'react-widgets/dist/css/react-widgets.css';
import './index.css';


function Reports(props) {
    const MySwal = withReactContent(Swal);
    const FORMAT = 'yyyy-MM-dd';
    const FORMATVIEW = 'dd/MM/yyyy';
    
    const [datea, setDatea] = useState();
    const [dateb, setDateb] = useState();
    const [dataChart, setDataChart] = useState([]);
    const [width, setWidth] = useState(600);
    const [height, setHeight] = useState(500);
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [types, setTypes] = useState([]);
    const [typeChart, setTypeChart] = useState([]);
    const [firstLook, setFirstLook] = useState(true);
    const [filterData, setFilterData] = useState(false);

    useEffect(() => {
        async function filter() {
            await api.get("/reports", {
                headers: {
                    date_a: dateFnsFormat(datea, FORMAT),
                    date_b: dateFnsFormat(dateb, FORMAT),
                    type_chart: typeChart.type_chart
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

        async function verify() {
            const response = await api.get("/userLogged");
            if(response.data.user.function !== 'adm') {
                props.history.push("/schedule/new");
            }
            else{
                return true;
            }
        }
        
        if(!firstLook) {
            filter();
        }

        setShow(verify());
        setTypes([{ name: "Ano", type_chart: "category"}, 
                  { name: "Curso", type_chart: "course"}, 
                  { name: "Equipamento", type_chart: "equipament"},
                  { name: "Sala", type_chart: "place"},
                  { name: "Usuários", type_chart: "requesting_user"}]);
        setFilterData(false);
    }, [filterData]);    

    async function onFilter() {
        setIsLoading(true);
        setFilterData(true);
        setFirstLook(false);
    }
      
    return (
        <div>
            {   
                (show) ?   
                (<>
                <Index></Index>
                <div className="d-flex align-items-center justify-content-center mt-2">
                    <div className="container-index mb-3 ">

                        <div className="row flex-wrap">   
                            <div className="column mt-1">
                                <DayPickerInput
                                    onDayChange={setDatea}
                                    className="date-input tam"
                                    formatDate={formatDate}
                                    format={FORMATVIEW}
                                    parseDate={parseDate}
                                    placeholder="De"
                                    value={datea}
                                />
                            </div>                         
                            
                            <div className="column mt-1 ml-2 mr-2">
                                <DayPickerInput
                                    onDayChange={setDateb}
                                    className="date-input tam"
                                    formatDate={formatDate}
                                    format={FORMATVIEW}
                                    parseDate={parseDate}
                                    placeholder="Até"
                                    value={dateb}
                                />
                            </div>
                            
                            <div className="column mt-1">
                                <Combobox 
                                    textField='name' 
                                    data={types} 
                                    onChange={setTypeChart}
                                    value={typeChart}
                                    placeholder="Tipo" 
                                    className="tam" 
                                />
                            </div>
                            
                            <div className="column ml-2 mt-1">
                                <button onClick={onFilter} className="btFiltrar bt-height">
                                    Filtrar
                                    <Spinner className="ml-2" color="#727981" size={16} speed={0.5} animating={isLoading} />
                                </button>
                            </div>
                            
                        </div>

                        <div className="d-flex align-items-center justify-content-center mt-5">

                            <WindowSizeListener onResize={windowSize => {
                                setWidth(windowSize.windowWidth-200);
                                setHeight(windowSize.windowHeight-100);
                                }}/>
                            {(firstLook) ? (
                                <p>Selecione o tipo de gráfico desejado</p>
                            ) : (
                                <Chart
                                    width={width}
                                    height={height}
                                    chartType="ColumnChart"
                                    loader={<div>Loading Chart <Spinner className="ml-2" color="#727981" size={16} speed={0.5} animating={true} /></div>}
                                    data={dataChart}
                                    options={{
                                        title: 'Utilizações em agendamentos',
                                        chartArea: { width: '70%' },
                                        hAxis: {
                                            title: 'Nomes',
                                            minValue: 0,
                                        },
                                        vAxis: {
                                            title: 'Total de utilizações',
                                        },
                                    }}
                                    
                                    legendToggle
                                />
                            )}
                        </div>
                        
                        
                    </div>
                </div>
                </>)
                :
                (<Index></Index>)
            }
        </div>
    );
}

export default withRouter(Reports);