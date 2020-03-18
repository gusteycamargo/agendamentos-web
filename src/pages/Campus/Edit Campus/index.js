import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'react-activity/lib/Spinner/Spinner.css';
import FormCampus from '../../../components/Form Campus';

function EditCampus(props) {
    const MySwal = withReactContent(Swal);
    
    const [campuses, setCampuses] = useState([]);
    const [campus, setCampus] = useState('');
    const [edit, setEdit] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        async function retrieveCampuses() {
            await api.get("/campuses")
            .then(function (response) {
                setCampuses(response.data);
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
        retrieveCampuses();
    }, [edit]);

    async function editCampus(id, data) {
        await api.put(`/campuses/${id}`, data)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Campus editado com sucesso', 'success');
            setEdit(false);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar visualizar as informações, tente novamente!', 'error');
        });
    }

    function defineEdit(campus) {
        setCampus(campus);
        setEdit(true);
    }

    function returnToTable() {
        setEdit(false);
    }
    
      
    return (
        <div>
            {     
                (show) ? 
                (
                <>
                    <Index></Index>
                    <div className="d-flex align-items-center justify-content-center mt-2">
                        <div className="container-index">
                            {
                                (edit) ?
                                    (
                                        <>
                                            <FormCampus onSubmit={editCampus} campus={campus}></FormCampus>
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
                                                    <th scope="col">Cidade</th>
                                                    <th scope="col">Endereço</th>
                                                    <th scope="col">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {campuses.map(campus => (
                                                    <tr key={campus.id}>
                                                        <td>{campus.city}</td>
                                                        <td>{campus.adress}</td>
                                                        <td><button onClick={() => defineEdit(campus)} className="btn btn-primary btnColor">
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
                </>
                ) : (<Index></Index>) 
                
            }
        </div>
    );
}

export default withRouter(EditCampus);