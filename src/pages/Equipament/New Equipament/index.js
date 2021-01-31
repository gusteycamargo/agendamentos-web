import 'bootstrap/dist/css/bootstrap.css';

import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import FormEquipament from '../../../components/Form Equipament';
import { useSelector } from 'react-redux';

function NewEquipament({ history }) {
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
    
    async function save(id, data) {
        return new Promise((resolve, reject) => {
            api.post("/equipaments", data)
            .then(resolve)
            .catch(reject)
        })
    }
      
    return (
        <div>
            {(show) &&
                <div className="container d-flex flex-column align-items-center justify-content-center">
                    <FormEquipament onSubmit={save} equipament={''}></FormEquipament>
                </div>
            }
        </div>
    );
}

export default withRouter(NewEquipament);