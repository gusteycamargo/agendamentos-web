import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'react-activity/lib/Spinner/Spinner.css';

function DeleteEquipament(props) {
    const MySwal = withReactContent(Swal);
    
    const [equipaments, setEquipaments] = useState([]);
    const [equipament, setEquipament] = useState('');
    const [deleted, setDeleted] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        async function retrieveEquipaments() {
            await api.get("/equipaments")
            .then(function (response) {
                const equipamentsReceived = response.data.filter((elem) => {
                    return elem.status === 'Ativo';
                });

                setEquipaments(equipamentsReceived);
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
        retrieveEquipaments();
    }, [deleted]);

    async function deleteEquipaments(id) {
        await api.delete(`/equipaments/${id}`)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Equipamento deletado com sucesso', 'success');
            setDeleted(true);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar editar as informações, tente novamente!', 'error');
        });
    }

    function confirmDelete(equipament) {
        MySwal.fire({
            title: 'Tem certeza?',
            text: "Não há como desfazer essa ação!!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sim, exclua!'
          }).then((result) => {
            if (result.value) {
                deleteEquipaments(equipament.id);
                setDeleted(false);
            }
        });     
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
                                                    <button onClick={() => confirmDelete(equipament)} className="btn btn-primary btnColor">
                                                        Excluir
                                                    </button>
                                                </td>
                                            </tr>
                                        ))} 
                                        
                                    </tbody>
                                </table>
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

export default withRouter(DeleteEquipament);