import 'bootstrap/dist/css/bootstrap.css';

import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import FormUser from '../../../components/Form User';
import { useSelector } from 'react-redux';

function NewCategory({ history }) {
    const [show, setShow] = useState(false);
    const MySwal = withReactContent(Swal);
    const userLogged = useSelector(state => state.userLogged.userLogged);

    useEffect(() => {        
        if(userLogged.function == 'adm') {
            setShow(true);
        }
        else {
            history.push("/schedule/new");
        }
    }, [history, userLogged]);

    function save(id, data) {
        return new Promise((resolve, reject) => {
            api.post("/users", data)
            .then(resolve)
            .catch(reject)
        })
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