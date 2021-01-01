import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import api from '../../../services/api';
import './index.css';
import 'react-activity/lib/Spinner/Spinner.css';
import Bounce from 'react-activity/lib/Bounce';
import 'react-activity/lib/Bounce/Bounce.css';
import { useSelector } from 'react-redux';
import TabWidth from '../../../components/TabWidth';

function ViewEquipament({ history }) {    
    const [equipaments, setEquipaments] = useState([]);
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const userLogged = useSelector(state => state.userLogged.userLogged);

    useEffect(() => {        
        if(userLogged.function == 'adm') {
            setShow(true);
        }
        else {
            history.push("/schedule/new");
        }
    }, [history, userLogged]);

    useEffect(() => {
        retrieveEquipaments();
    }, []);    

    async function retrieveEquipaments() {
        setIsLoading(true);
        await api.get("/equipaments")
        .then(function (response) {
            setEquipaments(response.data);
        })
        .catch(function (error) {
            console.log(error)
        });
        setIsLoading(false);
    }
      
    return (
        <div>
            {(show) &&
                <div className="d-flex align-items-center justify-content-center mt-2">
                    {(isLoading) &&
                        <div className="loading">
                            <Bounce color="#727981" size={40} speed={1} animating={isLoading} />
                        </div>
                    }
                    <div className="container-index">
                        <TabWidth>
                            <table className="table table-bordered table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Marca</th>
                                        <th scope="col">Número de patrimônio</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipaments.map(equipament => (
                                        <tr key={equipament.id}>
                                            <td><p>{equipament.name}</p></td>
                                            <td><p>{equipament.brand}</p></td>
                                            <td><p>{equipament.equityNumber}</p></td>
                                            <td><p>{equipament.status}</p></td>
                                        </tr>
                                    ))} 
                                    
                                </tbody>
                            </table>
                        </TabWidth>
                        {(equipaments.length <= 0) && 
                            <div className="zero">
                                <p>Nada a ser exibido</p>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default withRouter(ViewEquipament);