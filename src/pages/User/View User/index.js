import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'react-activity/lib/Spinner/Spinner.css';

function ViewUser(props) {
    const MySwal = withReactContent(Swal);
    
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function retrieveUsers() {
            await api.get("/users")
            .then(function (response) {
                setUsers(response.data);
            })
            .catch(function (error) {
                console.log(error)
                MySwal.fire('Oops...', 'Houve um tentar visualizar as informações, tente novamente!', 'error');
            });
        }

        retrieveUsers();
    }, [])
    
      
    return (
        <div>
            {      
                <>
                <Index></Index>
                <div className="d-flex align-items-center justify-content-center mt-2">
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
                                        <td>{user.fullname}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.function}</td>
                                        <td>{user.status}</td>
                                    </tr>
                                ))} 
                                
                            </tbody>
                        </table>
                    </div>
                </div>
                </>
            }
        </div>
    );
}

export default withRouter(ViewUser);