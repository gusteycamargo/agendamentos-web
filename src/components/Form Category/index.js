import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import './index.css';
import Spinner from 'react-activity/lib/Spinner';
import 'react-activity/lib/Spinner/Spinner.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useSelector } from 'react-redux';

function FormCategory({ onSubmit, category }) {
    const MySwal = withReactContent(Swal);

    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const userLogged = useSelector(state => state.userLogged.userLogged);

    useEffect(() => {
        if(category){
            setDescription(category.description);
        }
    }, [category])

    function save(e) {
        e.preventDefault();
        if(!description) { MySwal.fire('Descrição não preenchida', 'O campo descrição deve ser preenchido!', 'error'); return }     

        setIsLoading(true);
        onSubmit(category.id, {
            description,
            status: 'Ativo',
            campus_id: userLogged.campus_id,
        })
        .then(function (response) {
            setIsLoading(false);
            clear()
            MySwal.fire('Prontinho', 'Ano cadastrado com sucesso!', 'success');
        })
        .catch(function (error) {
            setIsLoading(false);
            console.log(error);
            if(error?.response?.data?.error) { MySwal.fire('Oops...', error.response.data.error, 'error') }
            else { MySwal.fire('Oops...', 'Houve um erro ao cadastrar, tente novamente!', 'error') }
        });
    }

    function clear() {
        setDescription('');
    }
      
    return (
        <div>
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
                        <button type="submit" className="btn btn-primary btnColor tam mt-3">
                            Salvar
                            <Spinner className="ml-2" color="#727981" size={16} speed={0.5} animating={isLoading} />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default withRouter(FormCategory);