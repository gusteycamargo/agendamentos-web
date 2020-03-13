import 'bootstrap/dist/css/bootstrap.css';

import React from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import FormEquipament from '../../../components/Form Equipament';

function NewEquipament(props) {
    const MySwal = withReactContent(Swal);
    
    async function save(id, data) {
        await api.post("/equipaments", data)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Equipamento cadastrado com sucesso!', 'success');
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um erro ao cadastrar, tente novamente!', 'error');
        });
    }
      
    return (
        <div>
            {      
                <>
                    <Index></Index>
                    <div className="container d-flex flex-column align-items-center justify-content-center">
                        <FormEquipament onSubmit={save} equipament={''}></FormEquipament>
                    </div>
                </>
            }
        </div>
    );
}

export default withRouter(NewEquipament);