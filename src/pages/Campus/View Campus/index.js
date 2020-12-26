import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import api from '../../../services/api';
import './index.css';
import 'react-activity/lib/Spinner/Spinner.css';
import Bounce from 'react-activity/lib/Bounce';
import 'react-activity/lib/Bounce/Bounce.css';
import { useSelector } from 'react-redux';
import isAdm from '../../../utils/isAdm';

function ViewCampus({ history }) {    
    const [campuses, setCampuses] = useState([]);
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const userLogged = useSelector(state => state.user);

    useEffect(() => {        
        if(isAdm(userLogged)) {
            setShow(true);
        }
        else {
            history.push("/schedule/new");
        }
    }, [history, userLogged]);

    useEffect(() => {
        async function retrieveCampuses() {
            setIsLoading(true);
            await api.get("/campuses")
            .then(function (response) {
                setCampuses(response.data);
            })
            .catch(function (error) {
                console.log(error)
            });
            setIsLoading(false);
        }

        retrieveCampuses();
    }, []);    
      
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
                        <table className="table table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Cidade</th>
                                    <th scope="col">Endereço</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>                               
                            <tbody>
                                {campuses.map(campus => (
                                    <tr key={campus.id}>
                                        <td><p>{campus.city}</p></td>
                                        <td><p>{campus.adress}</p></td>
                                        <td><p>{campus.status}</p></td>
                                    </tr>
                                ))} 
                                
                            </tbody>
                        </table>
                        {(campuses.length <= 0) && 
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

export default withRouter(ViewCampus);