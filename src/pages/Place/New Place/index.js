import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import FormPlace from '../../../components/Form Place';

function NewPlace(props) {

    useEffect(() => {
        async function verify() {
            const response = await api.get("/userLogged");
            if(response.data.user.function !== 'adm') {
                props.history.push("/schedule/new");
            }
            else{
                return true;
            }
        }
        setShow(verify());
    }, []);

    const [show, setShow] = useState(false);
    const MySwal = withReactContent(Swal);

    async function save(id, data) {
        await api.post("/places", data)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Sala cadastrada com sucesso!', 'success');
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um erro ao cadastrar, tente novamente!', 'error');
        });
    }
      
    return (
        <div>
            {  
                (show) ?    
                (<>
                    <Index></Index>
                    <div className="container d-flex flex-column align-items-center justify-content-center">
                        <FormPlace onSubmit={save} place={''}></FormPlace>
                    </div>
                </>)
                :
                (<Index></Index>)
            }
        </div>
    );
}

export default withRouter(NewPlace);