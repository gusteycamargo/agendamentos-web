import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import './index.css';
import Spinner from 'react-activity/lib/Spinner';
import 'react-activity/lib/Spinner/Spinner.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useSelector } from 'react-redux';

function FormEquipament({ onSubmit, equipament }) {
    const MySwal = withReactContent(Swal);

    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [equityNumber, setEquityNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const userLogged = useSelector(state => state.userLogged.userLogged);

    useEffect(() => {
        if(equipament){
            setName(equipament.name);
            setBrand(equipament.brand);
            setEquityNumber(equipament.equityNumber);
        }
    }, [equipament])

    function save(e) {
        e.preventDefault();
        if(!name) { MySwal.fire('Nome não preenchido', 'O campo nome deve ser preenchido!', 'error'); return }     
        if(!brand) { MySwal.fire('Marca não preenchida', 'O campo marca deve ser preenchido!', 'error'); return }     
        if(!equityNumber) { MySwal.fire('Número de patrimônio não preenchido', 'O campo número de patrimônio deve ser preenchido!', 'error'); return }     

        setIsLoading(true);
        onSubmit(equipament.id, {
            name,
            brand,
            equityNumber,
            status: 'Ativo',
            campus_id: userLogged.campus_id,
        })
        .then(function (response) {
            setIsLoading(false);
            clear()
            MySwal.fire('Prontinho', 'Equipamento cadastrado com sucesso!', 'success');
        })
        .catch(function (error) {
            setIsLoading(false);
            if(error?.response?.data?.error) { MySwal.fire('Oops...', error.response.data.error, 'error') }
            else { MySwal.fire('Oops...', 'Houve um erro ao cadastrar, tente novamente!', 'error') }
        });
        
    }

    function clear() {
        setName('');
        setBrand('');
        setEquityNumber('');
    }
      
    return (
        <div>
            <form onSubmit={save}>
                <div className="d-flex flex-row align-items justify-content-center">
                    <div className="d-flex flex-column pb-2 pt-5 ">
                        <input type="text" 
                                className="tam form-control" 
                                placeholder="Nome"
                                value={name}
                                onChange={e => setName(e.target.value)}
                        ></input>
                        <input type="text" 
                                className="tam form-control mt-2" 
                                placeholder="Marca"
                                value={brand}
                                onChange={e => setBrand(e.target.value)}
                        ></input>
                        <input type="text" 
                                className="tam form-control mt-2" 
                                placeholder="Número de patrimônio"
                                value={equityNumber}
                                onChange={e => setEquityNumber(e.target.value)}
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
        </div>
    );
}

export default withRouter(FormEquipament);