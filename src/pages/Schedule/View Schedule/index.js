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
    
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        async function retrieveSchedules() {
            await api.get("/schedules")
            .then(function (response) {
                setSchedules(response.data);
            })
            .catch(function (error) {
                console.log(error)
                MySwal.fire('Oops...', 'Houve um tentar visualizar as informações, tente novamente!', 'error');
            });
        }

        retrieveSchedules();
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
                                    <th scope="col">Data</th>
                                    <th scope="col">Início</th>
                                    <th scope="col">Término</th>
                                    <th scope="col">Solicitante</th>
                                    <th scope="col">Cadastrador</th>
                                    <th scope="col">Sala</th>
                                    <th scope="col">Equipamentos</th>
                                    <th scope="col">Ano</th>
                                    <th scope="col">Curso</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Observações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map(schedule => (
                                    <tr key={schedule.id}>
                                        <td>{schedule.date}</td>
                                        <td>{schedule.initial}</td>
                                        <td>{schedule.final}</td>
                                        <td>{schedule.requesting_user.fullname}</td>
                                        <td>{schedule.registration_user.fullname}</td>
                                        <td>{schedule.place.name}</td>
                                        <td>Colocar equipamentos tabela dentro de tabela</td>
                                        <td>{schedule.category.description}</td>
                                        <td>{schedule.course.name}</td>
                                        <td>{schedule.status}</td>
                                        <td>{schedule.comments}</td>
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