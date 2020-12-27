import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'react-activity/lib/Spinner/Spinner.css';
import FormEquipament from '../../../components/Form Equipament';
import Bounce from 'react-activity/lib/Bounce';
import 'react-activity/lib/Bounce/Bounce.css';
import { useSelector } from 'react-redux';

function EditEquipament({ history }) {
    const MySwal = withReactContent(Swal);
    
    const [equipaments, setEquipaments] = useState([]);
    const [equipament, setEquipament] = useState('');
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
        retrieveEquipaments();
    }, [edit]);

    async function retrieveEquipaments() {
        setIsLoading(true);
        await api.get("/equipaments")
        .then(function (response) {
            const equipamentsReceived = response.data.filter((elem) => {
                return elem.status === 'Ativo';
            });

            setEquipaments(equipamentsReceived);
        })
        .catch(function (error) {
            console.log(error)
        });
        setIsLoading(false);
    }

    async function editEquipaments(id, data) {
        setIsLoading(true);
        await api.put(`/equipaments/${id}`, data)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Equipamento editado com sucesso', 'success');
            setEdit(false);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar editar as informações, tente novamente!', 'error');
        });
        setIsLoading(false);
    }

    function defineEdit(equipament) {        
        setEquipament(equipament);
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
                                    <FormEquipament onSubmit={editEquipaments} equipament={equipament}></FormEquipament>
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
                                            <th scope="col">Nome</th>
                                            <th scope="col">Marca</th>
                                            <th scope="col">Número de patrimônio</th>
                                            <th scope="col">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {equipaments.map(equipament => (
                                            <tr key={equipament.id}>
                                                <td><p>{equipament.name}</p></td>
                                                <td><p>{equipament.brand}</p></td>
                                                <td><p>{equipament.equityNumber}</p></td>
                                                <td>
                                                    <button onClick={() => defineEdit(equipament)} className="btn btn-primary btnColor">
                                                        Editar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))} 
                                        
                                    </tbody>
                                </table>
                            )}
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

export default withRouter(EditEquipament);