import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'react-activity/lib/Spinner/Spinner.css';
import Bounce from 'react-activity/lib/Bounce';
import 'react-activity/lib/Bounce/Bounce.css';
import { useSelector } from 'react-redux';
import isAdm from '../../../utils/isAdm';

function DeletePlace({ history }) {
    const MySwal = withReactContent(Swal);
    
    const [places, setPlaces] = useState([]);
    const [deleted, setDeleted] = useState(false);
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
        async function retrievePlaces() {
            setIsLoading(true);
            await api.get("/places")
            .then(function (response) {
                const placesReceived = response.data.filter((elem) => {
                    return elem.status === 'Ativo';
                });

                setPlaces(placesReceived);
            })
            .catch(function (error) {
                console.log(error)
            });
            setIsLoading(false);
        }

        retrievePlaces();
    }, [deleted]);

    async function deletePlaces(id) {
        setIsLoading(true);
        await api.delete(`/places/${id}`)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Sala deletada com sucesso', 'success');
            setDeleted(true);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar editar as informações, tente novamente!', 'error');
        });
        setIsLoading(false);
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
                    </div>
                </div>
            }
        </div>
    );
}

export default withRouter(DeletePlace);