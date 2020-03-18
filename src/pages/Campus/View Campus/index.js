import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'react-activity/lib/Spinner/Spinner.css';

function ViewCampus(props) {
    const MySwal = withReactContent(Swal);
    
    const [campuses, setCampuses] = useState([]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        async function retrieveCampuses() {
            await api.get("/campuses")
            .then(function (response) {
                setCampuses(response.data);
            })
            .catch(function (error) {
                console.log(error)
                MySwal.fire('Oops...', 'Houve um tentar visualizar as informações, tente novamente!', 'error');
            });
        }

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
        retrieveCampuses();
    }, []);    
      
    return (
        <div>
            {    
                (show) ?  
                (<>
                <Index></Index>
                <div className="d-flex align-items-center justify-content-center mt-2">
                    <div className="container-index">
                        <table className="table table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Cidade</th>
                                    <th scope="col">Endereço</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campuses.map(campus => (
                                    <tr key={campus.id}>
                                        <td>{campus.city}</td>
                                        <td>{campus.adress}</td>
                                        <td>{campus.status}</td>
                                    </tr>
                                ))} 
                                
                            </tbody>
                        </table>
                    </div>
                </div>
                </>)
                :
                (<Index></Index>)
            }
        </div>
    );
}

export default withRouter(ViewCampus);