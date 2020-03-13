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

function EditPlace(props) {
    const MySwal = withReactContent(Swal);
    
    const [places, setPlaces] = useState([]);
    const [place, setPlace] = useState('');
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        async function retrievePlaces() {
            await api.get("/places")
            .then(function (response) {
                setPlaces(response.data);
            })
            .catch(function (error) {
                console.log(error)
                MySwal.fire('Oops...', 'Houve um tentar visualizar as informações, tente novamente!', 'error');
            });
        }

        retrievePlaces();
    }, [edit]);

    async function editPlaces(id, data) {
        await api.put(`/places/${id}`, data)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Sala editada com sucesso', 'success');
            setEdit(false);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar editar as informações, tente novamente!', 'error');
        });
    }

    function defineEdit(place) {        
        setPlace(place);
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
                                        <FormPlace onSubmit={editPlaces} place={place}></FormPlace>
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
                                                        <button onClick={() => defineEdit(place)} className="btn btn-primary btnColor">
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

export default withRouter(EditPlace);