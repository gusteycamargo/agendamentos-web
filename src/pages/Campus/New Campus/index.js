import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useSelector } from 'react-redux';
import isAdm from '../../../utils/isAdm';
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import FormCampus from '../../../components/Form Campus';

function NewCampus({ history }) {
    const [show, setShow] = useState(false);
    const MySwal = withReactContent(Swal);
    const userLogged = useSelector(state => state.user);

    useEffect(() => {        
        if(isAdm(userLogged)) {
            setShow(true);
        }
        else {
            history.push("/schedule/new");
        }
    }, [history, userLogged]);
    
    async function save(id, data) {
        await api.post("/campuses", data)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Campus cadastrado com sucesso!', 'success');       
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um erro ao cadastrar, tente novamente!', 'error');
        });
    }
      
    return (
        <div>
            {(show) &&
                <div className="container d-flex flex-column align-items-center justify-content-center">
                    <FormCampus onSubmit={save} campus={''}></FormCampus>
                </div>
            }
        </div>
    );
}

export default withRouter(NewCampus);