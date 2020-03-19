import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'react-activity/lib/Spinner/Spinner.css';
import FormPlace from '../../../components/Form Place';

function DeletePlace(props) {
    const MySwal = withReactContent(Swal);
    
    const [places, setPlaces] = useState([]);
    const [place, setPlace] = useState('');
    const [deleted, setDeleted] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        async function retrievePlaces() {
            await api.get("/places")
            .then(function (response) {
                const placesReceived = response.data.filter((elem) => {
                    return elem.status === 'Ativo';
                });

                setPlaces(placesReceived);
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
        retrievePlaces();
    }, [deleted]);

    async function deletePlaces(id) {
        await api.delete(`/places/${id}`)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Sala deletada com sucesso', 'success');
            setDeleted(true);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar editar as informações, tente novamente!', 'error');
        });
    }

    function confirmDelete(place) {
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
                deletePlaces(place.id);
                setDeleted(false);
            }
        });     
    }  

    return (
        <div>
            {      
                <>
                <Index></Index>
                <div className="d-flex align-items-center justify-content-center mt-2">
                    <div className="container-index">
                        {
                            <table className="table table-bordered table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Capacidade</th>
                                        <th scope="col">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {places.map(place => (
                                        <tr key={place.id}>
                                            <td>{place.name}</td>
                                            <td>{place.capacity}</td>
                                            <td>
                                                <button onClick={() => confirmDelete(place)} className="btn btn-primary btnColor">
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
                </>
            }
        </div>
    );
}

export default withRouter(DeletePlace);