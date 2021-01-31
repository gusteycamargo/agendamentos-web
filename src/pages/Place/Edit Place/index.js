import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'react-activity/lib/Spinner/Spinner.css';
import FormPlace from '../../../components/Form Place';
import Bounce from 'react-activity/lib/Bounce';
import 'react-activity/lib/Bounce/Bounce.css';
import { useSelector } from 'react-redux';
import TabWidth from '../../../components/TabWidth';

function EditPlace({ history }) {
    const MySwal = withReactContent(Swal);
    
    const [places, setPlaces] = useState([]);
    const [place, setPlace] = useState('');
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
        retrievePlaces();
    }, [edit]);

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

    async function editPlaces(id, data) {
        setIsLoading(true);
        return new Promise((resolve, reject) => {
            api.put(`/places/${id}`, data)
            .then(resolve)
            .then(() => setEdit(false))
            .catch(reject)
            .finally(() => setIsLoading(false))
        })
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
                                <TabWidth>
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
                                                    <td><p>{place.name}</p></td>
                                                    <td><p>{place.capacity}</p></td>
                                                    <td>
                                                        <button onClick={() => defineEdit(place)} className="btn btn-primary btnColor">
                                                            Editar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))} 
                                            
                                        </tbody>
                                    </table>
                                </TabWidth>
                        )} 
                        {(places.length <= 0) && 
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

export default withRouter(EditPlace);