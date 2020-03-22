import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../components/Index";
import api from '../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Spinner from 'react-activity/lib/Spinner';
import 'react-activity/lib/Spinner/Spinner.css';
import { Chart } from "react-google-charts";
import WindowSizeListener from 'react-window-size-listener'

function Reports(props) {
    const MySwal = withReactContent(Swal);
    
    const [places, setPlaces] = useState([]);
    const [width, setWidth] = useState(600);
    const [height, setHeight] = useState(500);
    const [show, setShow] = useState(false);

    useEffect(() => {
        async function retrievePlaces() {
            await api.get("/reports", {
                headers: {
                    date_a: '2020-03-11',
                    date_b: '2020-03-21',
                    type_chart: 'requesting_user'
                }
            })
            .then(function (response) {
                setPlaces(response.data);                
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
        

        setShow(verify());
        retrievePlaces();
    }, [width]);    
      
    return (
        <div>
            {   
                (show) ?   
                (<>
                <Index></Index>
                <div className="d-flex align-items-center justify-content-center mt-2">
                    <div className="container-index mb-3">
                    <WindowSizeListener onResize={windowSize => {
                        setWidth(windowSize.windowWidth-200);
                        setHeight(windowSize.windowHeight-100);
                        }}/>
                    <Chart
                        width={width}
                        height={height}
                        chartType="ColumnChart"
                        loader={<div>Loading Chart <Spinner className="ml-2" color="#727981" size={16} speed={0.5} animating={true} /></div>}
                        data={places}
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