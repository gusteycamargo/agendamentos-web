import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import './index.css';
import Spinner from 'react-activity/lib/Spinner';
import 'react-activity/lib/Spinner/Spinner.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function FormCampus({ onSubmit, campus }) {
    const MySwal = withReactContent(Swal);

    const [adress, setAdress] = useState('');
    const [city, setCity] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(campus !== ''){
            setCity(campus.city);
            setAdress(campus.adress);
        }
    }, [])

    async function save(e) {
        e.preventDefault();

        if(city && adress) {
            setIsLoading(true);
            await onSubmit(campus.id, {
                city,
                adress,
                status: "Ativo"
            })
            setIsLoading(false);
            setCity('');
            setAdress('');
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
                                    placeholder="Cidade"
                                    value={city}
                                    onChange={e => setCity(e.target.value)}
                            ></input>
                            <input type="text" 
                                    className="tam form-control mt-2" 
                                    placeholder="Endereço"
                                    value={adress}
                                    onChange={e => setAdress(e.target.value)}
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

export default withRouter(FormCampus);