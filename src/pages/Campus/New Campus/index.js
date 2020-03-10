import 'bootstrap/dist/css/bootstrap.css';

import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Spinner from 'react-activity/lib/Spinner';
import 'react-activity/lib/Spinner/Spinner.css';

function NewCampus(props) {
    const MySwal = withReactContent(Swal);
    
    const [adress, setAdress] = useState('');
    const [city, setCity] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function save() {
        if(city && adress) {
            setIsLoading(true);
            await api.post("/campuses", {
                    city,
                    adress,
                    status: 'Ativo'
            })
            .then(function (response) {
                console.log(response.data);
                MySwal.fire('Prontinho', 'Campus cadastrado com sucesso!', 'success');
                setCity('');
                setAdress('');
            })
            .catch(function (error) {
                console.log(error)
                MySwal.fire('Oops...', 'Houve um erro ao cadastrar, tente novamente!', 'error');
            });
            setIsLoading(false);
        }
        else {
            MySwal.fire('Campos não preenchidos...', 'Preencha todos os campos!', 'error')
        }
    }
      
    return (
        <div>
            {      
                <>
                <Index></Index>
                <div className="container d-flex flex-column align-items-center justify-content-center">
                    <div className="d-flex flex-row">
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
                                onClick={save} 
                                className="btn btn-primary btnColor tam mt-3"
                                >
                                    Salvar
                                    <Spinner className="ml-2" color="#727981" size={16} speed={0.5} animating={isLoading} />
                            </button>
                        </div>
                    </div>
                </div>
                </>
            }
        </div>
    );
}

export default withRouter(NewCampus);