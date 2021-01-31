import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'react-activity/lib/Spinner/Spinner.css';
import FormCampus from '../../../components/Form Campus';
import Bounce from 'react-activity/lib/Bounce';
import 'react-activity/lib/Bounce/Bounce.css';
import { useSelector } from 'react-redux';
import TabWidth from '../../../components/TabWidth';

function EditCampus({ history }) {
    const MySwal = withReactContent(Swal);
    
    const [campuses, setCampuses] = useState([]);
    const [campus, setCampus] = useState('');
    const [edit, setEdit] = useState(false);
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
        async function retrieveCampuses() {
            setIsLoading(true);
            await api.get("/campuses")
            .then(function (response) {
                const campusesReceived = response.data.filter((elem) => {
                    return elem.status === 'Ativo';
                });

                setCampuses(campusesReceived);
            })
            .catch(function (error) {
                console.log(error)
            });
            setIsLoading(false);
        }

        retrieveCampuses();
    }, [edit]);

    async function editCampus(id, data) {
        setIsLoading(true);
        return new Promise((resolve, reject) => {
            api.put(`/campuses/${id}`, data)
            .then(resolve)
            .then(() => setEdit(false))
            .catch(reject)
            .finally(() => setIsLoading(false))
        })
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
            {(show) &&
                <div className="d-flex align-items-center justify-content-center mt-2">
                    {(isLoading) &&
                        <div className="loading">
                            <Bounce color="#727981" size={40} speed={1} animating={isLoading} />
                        </div>
                    }
                    <div className="container-index">
                        {(edit) ?
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
                                <TabWidth>
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
                                                    <td><p>{campus.city}</p></td>
                                                    <td><p>{campus.adress}</p></td>
                                                    <td><button onClick={() => defineEdit(campus)} className="btn btn-primary btnColor">
                                                            Editar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))} 
                                            
                                        </tbody>
                                    </table>
                                </TabWidth>
                        )}   
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

export default withRouter(EditCampus);