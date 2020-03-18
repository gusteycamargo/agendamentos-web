import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'react-activity/lib/Spinner/Spinner.css';
import FormUser from '../../../components/Form User';

function EditUser(props) {
    const MySwal = withReactContent(Swal);
    
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState('');
    const [edit, setEdit] = useState(false);
    const [show, setShow] = useState(false);

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
        retrieveUsers();
    }, [edit]);

    async function editUsers(id, data) {
        await api.put(`/users/${id}`, data)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Campus editado com sucesso', 'success');
            setEdit(false);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar visualizar as informações, tente novamente!', 'error');
        });
    }

    function defineEdit(user) {
        setUser(user);
        setEdit(true);
    }

    function returnToTable() {
        setEdit(false);
    }
    
      
    return (
        <div>
            {    
                (show) ?  
                (<>
                <Index></Index>
                <div className="d-flex align-items-center justify-content-center mt-2">
                    <div className="container-index">
                        {
                            (edit) ?
                                (
                                    <>
                                        <FormUser onSubmit={editUsers} user={user}></FormUser>
                                        <div className="d-flex flex-row align-items justify-content-center">
                                            <button onClick={returnToTable} className="btn btn-primary btnColor tam">
                                                Voltar
                                            </button>
                                        </div>
                                    </>
                                ) 
                                : 
                                (
                                    <table className="table table-bordered table-hover">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th scope="col">Nome completo</th>
                                                <th scope="col">Nome de usuário</th>
                                                <th scope="col">E-mail</th>
                                                <th scope="col">Função</th>
                                                <th scope="col">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(user => (
                                                <tr key={user.id}>
                                                    <td>{user.fullname}</td>
                                                    <td>{user.username}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.function}</td>
                                                    <td>
                                                        <button onClick={() => defineEdit(user)} className="btn btn-primary btnColor">
                                                            Editar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))} 
                                            
                                        </tbody>
                                    </table>
                                )
                        }
                        
                    </div>
                </div>
                </>)
                :
                (<Index></Index>)
            }
        </div>
    );
}

export default withRouter(EditUser);