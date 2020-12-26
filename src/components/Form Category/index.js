import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import './index.css';
import api from '../../services/api';
import Spinner from 'react-activity/lib/Spinner';
import 'react-activity/lib/Spinner/Spinner.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function FormCategory({ onSubmit, category }) {
    const MySwal = withReactContent(Swal);

    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(category !== ''){
            setDescription(category.description);
        }
    }, [category])

    async function save(e) {
        e.preventDefault();
        const userLogged = await api.get('/userLogged');
        if(description) {
            setIsLoading(true);
            await onSubmit(category.id, {
                description,
                status: 'Ativo',
                campus_id: userLogged.data.campus.id,
            });
            setIsLoading(false);
            setDescription('');
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
                            <input 
                                type="text" 
                                className="tam form-control" 
                                placeholder="Descrição"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
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

export default withRouter(FormCategory);