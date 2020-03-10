import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'react-activity/lib/Spinner/Spinner.css';

function ViewPlace(props) {
    const MySwal = withReactContent(Swal);
    
    const [places, setPlaces] = useState([]);

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
                                    <th scope="col">Nome</th>
                                    <th scope="col">Capacidade</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {places.map(place => (
                                    <tr key={place.id}>
                                        <td>{place.name}</td>
                                        <td>{place.capacity}</td>
                                        <td>{place.status}</td>
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

export default withRouter(ViewPlace);