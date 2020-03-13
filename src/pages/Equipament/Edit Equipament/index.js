import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'react-activity/lib/Spinner/Spinner.css';
import FormEquipament from '../../../components/Form Equipament';

function EditEquipament(props) {
    const MySwal = withReactContent(Swal);
    
    const [equipaments, setEquipaments] = useState([]);
    const [equipament, setEquipament] = useState('');
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        async function retrieveEquipaments() {
            await api.get("/equipaments")
            .then(function (response) {
                setEquipaments(response.data);
            })
            .catch(function (error) {
                console.log(error)
                MySwal.fire('Oops...', 'Houve um tentar visualizar as informações, tente novamente!', 'error');
            });
        }

        retrieveEquipaments();
    }, [edit]);

    async function editEquipaments(id, data) {
        await api.put(`/equipaments/${id}`, data)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Equipamento editado com sucesso', 'success');
            setEdit(false);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar editar as informações, tente novamente!', 'error');
        });
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
            {      
                <>
                <Index></Index>
                <div className="d-flex align-items-center justify-content-center mt-2">
                    <div className="container-index">
                        {
                            (edit) ?
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
                                                    <td>{equipament.name}</td>
                                                    <td>{equipament.brand}</td>
                                                    <td>{equipament.equityNumber}</td>
                                                    <td>
                                                        <button onClick={() => defineEdit(equipament)} className="btn btn-primary btnColor">
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
            }
        </div>
    );
}

export default withRouter(EditEquipament);