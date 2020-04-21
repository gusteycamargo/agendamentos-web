import 'bootstrap/dist/css/bootstrap.css';
// import 'react-day-picker/lib/style.css';
// import 'react-activity/lib/Spinner/Spinner.css';
// import 'react-widgets/dist/css/react-widgets.css';
// import './index.css';
import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import FormSchedule from '../../../components/Form Schedule';

function NewSchedule(props) {
    const MySwal = withReactContent(Swal);  

    async function save(id, data) {
        await api.post("/schedules", data)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Agendamento realizado com sucesso!', 'success');
        })
        .catch(function (error) {
            MySwal.fire('Oops...', 'Houve um erro ao realizar seu agendamento, tente novamente!', 'error');
        });
    }
      
    return (
        <div>
            {      
                <>
                <Index></Index>
                <div className="container d-flex flex-column align-items-center justify-content-center">
                    <FormSchedule onSubmit={save} schedule={''}></FormSchedule>
                </div>
                </>
            }
        </div>
    );
}

export default withRouter(NewSchedule);