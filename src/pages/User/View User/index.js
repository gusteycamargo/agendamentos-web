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

function ViewUser({ history }) {
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
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
        async function retrieveUsers() {
            setIsLoading(true);
            await api.get("/users")
            .then(function (response) {
                setUsers(response.data);
            })
            .catch(function (error) {
                console.log(error)
            });
            setIsLoading(false);
        }

        retrieveUsers();
    }, [])
    
      
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
                                    <th scope="col">Nome completo</th>
                                    <th scope="col">Nome de usuário</th>
                                    <th scope="col">E-mail</th>
                                    <th scope="col">Função</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td><p>{user.fullname}</p></td>
                                        <td><p>{user.username}</p></td>
                                        <td><p>{user.email}</p></td>
                                        <td><p>{user.function}</p></td>
                                        <td><p>{user.status}</p></td>
                                    </tr>
                                ))}                                            
                            </tbody>
                        </table>
                        {(users.length <= 0) && 
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

export default withRouter(ViewUser);