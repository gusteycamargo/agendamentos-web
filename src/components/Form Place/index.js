import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import './index.css';
import api from '../../services/api';
import Spinner from 'react-activity/lib/Spinner';
import 'react-activity/lib/Spinner/Spinner.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function FormPlace({ onSubmit, place }) {
    const MySwal = withReactContent(Swal);

    const [capacity, setCapacity] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(place !== ''){
            setName(place.name);
            setCapacity(place.capacity);
        }
    }, [place])

    async function save(e) {
        e.preventDefault();

        if(capacity && name) {
            const userLogged = await api.get('/userLogged');
            setIsLoading(true);
            await onSubmit(place.id, {
                name,
                capacity,
                status: 'Ativo',
                campus_id: userLogged.data.campus.id,
            })
            setIsLoading(false);
            setName('');
            setCapacity('');
        }
        else {
            MySwal.fire('Campos não preenchidos...', 'Preencha todos os campos!', 'error')
        }
    }
      
    return (
        <div>
            {      
                <form onSubmit={save}>
                    <div className="d-flex flex-row align-items justify-content-center">
                        <div className="d-flex flex-column pb-2 pt-5 ">
                            <input type="text" 
                                   className="tam form-control" 
                                   placeholder="Nome"
                                   value={name}
                                   onChange={e => setName(e.target.value)}
                            ></input>
                            <input type="number" 
                                   className="tam form-control mt-2" 
                                   placeholder="Capacidade"
                                   value={capacity}
                                   onChange={e => setCapacity(e.target.value)}
                            ></input>
                            <button 
                                type="submit"
                                className="btn btn-primary btnColor tam mt-3"
                                >
                                    Salvar
                                    <Spinner className="ml-2" color="#727981" size={16} speed={0.5} animating={isLoading} />
                            </button>
                        </div>
                    </div>
                </form>
            }
        </div>
    );
}

export default withRouter(FormPlace);