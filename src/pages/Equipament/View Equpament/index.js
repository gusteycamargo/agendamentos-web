import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'react-activity/lib/Spinner/Spinner.css';
import Bounce from 'react-activity/lib/Bounce';
import 'react-activity/lib/Bounce/Bounce.css';

function ViewEquipament(props) {
    const MySwal = withReactContent(Swal);
    
    const [equipaments, setEquipaments] = useState([]);
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function retrieveEquipaments() {
            setIsLoading(true);
            await api.get("/equipaments")
            .then(function (response) {
                setEquipaments(response.data);
            })
            .catch(function (error) {
                console.log(error)
                MySwal.fire('Oops...', 'Houve um tentar visualizar as informações, tente novamente!', 'error');
            });
            setIsLoading(false);
        }

        async function verify() {
            setIsLoading(true);
            const response = await api.get("/userLogged");
            setIsLoading(false);
            if(response.data.user.function !== 'adm') {
                props.history.push("/schedule/new");
            }
            else{
                return true;
            }
        }

        setShow(verify());
        retrieveEquipaments();
    }, []);    
      
    return (
        <div>
            {      
                (show) ?  
                (
                <>
                <Index></Index>
                <div className="d-flex align-items-center justify-content-center mt-2">
                    <div className="container-index">
                        <table className="table table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Nome</th>
                                    <th scope="col">Marca</th>
                                    <th scope="col">Número de patrimônio</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            {(isLoading) ? 
                                (
                                    <tbody>
                                        <tr className="loading">
                                            <Bounce color="#727981" size={40} speed={1} animating={isLoading} />
                                        </tr>
                                    </tbody>
                                ) : 
                                (
                                    <tbody>
                                        {equipaments.map(equipament => (
                                            <tr key={equipament.id}>
                                                <td>{equipament.name}</td>
                                                <td>{equipament.brand}</td>
                                                <td>{equipament.equityNumber}</td>
                                                <td>{equipament.status}</td>
                                            </tr>
                                        ))} 
                                        
                                    </tbody>
                                )
                            }
                        </table>
                    </div>
                </div>
                </>
                )
                :
                (<Index></Index>)
            }
        </div>
    );
}

export default withRouter(ViewEquipament);