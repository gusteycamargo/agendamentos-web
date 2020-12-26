import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'react-activity/lib/Spinner/Spinner.css';
import Bounce from 'react-activity/lib/Bounce';
import 'react-activity/lib/Bounce/Bounce.css';
import { useSelector } from 'react-redux';
import isAdm from '../../../utils/isAdm';

function DeleteCategory({ history }) {
    const MySwal = withReactContent(Swal);
    const [categories, setCategories] = useState([]);
    const [deleted, setDeleted] = useState(false);
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const userLogged = useSelector(state => state.user);

    useEffect(() => {        
        if(isAdm(userLogged)) {
            setShow(true);
        }
        else {
            history.push("/schedule/new");
        }
    }, [history, userLogged]);

    useEffect(() => {
        async function retrieveCategories() {
            setIsLoading(true);
            await api.get("/categories")
            .then(function (response) {
                const categoriesReceived = response.data.filter((elem) => {
                    return elem.status === 'Ativo';
                });

                setCategories(categoriesReceived);
            })
            .catch(function (error) {
                console.log(error)
            });
            setIsLoading(false);
        }

        retrieveCategories();
    }, [deleted]);

    async function deleteCategories(id) {
        setIsLoading(true);
        await api.delete(`/categories/${id}`)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Ano deletado com sucesso', 'success');
            setDeleted(true);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar editar as informações, tente novamente!', 'error');
        });
        setIsLoading(false);
    }

    function confirmDelete(category) {
        MySwal.fire({
            title: 'Tem certeza?',
            text: "Não há como desfazer essa ação!!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sim, exclua!'
          }).then((result) => {
            if (result.value) {
                deleteCategories(category.id);
                setDeleted(false);
            }
        });     
    }
      
    return (
        <div>
            {(show) &&
                <div className="d-flex align-items-center justify-content-center mt-2">
                    {(isLoading) &&
                        <div className="loading">
                            <Bounce color="#727981" size={40} speed={1} animating={isLoading} />
                        </div>
                    }
                    <div className="container-index">
                        <table className="table table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Descrição</th>
                                    <th scope="col">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(category => (
                                    <tr key={category.id}>
                                        <td><p>{category.description}</p></td>
                                        <td>
                                            <button onClick={() => confirmDelete(category)} className="btn btn-danger btnColor">
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}                                        
                            </tbody>
                        </table>
                        {(categories.length <= 0) && 
                            <div className="zero">
                                <p>Nada a ser exibido</p>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default withRouter(DeleteCategory);