import 'bootstrap/dist/css/bootstrap.css';

import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import FormUser from '../../../components/Form User';
import { useSelector } from 'react-redux';
import isAdm from '../../../utils/isAdm';

function NewCategory({ history }) {
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
        await api.post("/users", data)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Usuário cadastrado com sucesso!', 'success');
            
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
                    <FormUser onSubmit={save} user={''}></FormUser>
                </div>
            }
        </div>
    );
}

export default withRouter(NewCategory);