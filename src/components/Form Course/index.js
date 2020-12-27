import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import './index.css';
import Spinner from 'react-activity/lib/Spinner';
import 'react-activity/lib/Spinner/Spinner.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useSelector } from 'react-redux';

function FormCourse({ onSubmit, course }) {
    const MySwal = withReactContent(Swal);

    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const userLogged = useSelector(state => state.userLogged.userLogged);

    useEffect(() => {
        if(course){
            setName(course.name);
        }
    }, [course])

    async function save(e) {
        e.preventDefault();
        if(!name) { MySwal.fire('Nome não preenchido', 'O campo nome deve ser preenchido!', 'error'); return }     

        setIsLoading(true);
        await onSubmit(course.id, {
            name,
            status: 'Ativo',
            campus_id: userLogged.campus_id,
        })
        setIsLoading(false);
        setName('');
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

export default withRouter(FormCourse);