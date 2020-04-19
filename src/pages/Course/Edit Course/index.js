import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'react-activity/lib/Spinner/Spinner.css';
import FormCourse from '../../../components/Form Course';
import Bounce from 'react-activity/lib/Bounce';
import 'react-activity/lib/Bounce/Bounce.css';

function EditCourse(props) {
    const MySwal = withReactContent(Swal);
    
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState('');
    const [edit, setEdit] = useState(false);
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function retrieveCourses() {
            setIsLoading(true);
            await api.get("/courses")
            .then(function (response) {
                const coursesReceived = response.data.filter((elem) => {
                    return elem.status === 'Ativo';
                });

                setCourses(coursesReceived);
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
        retrieveCourses();
    }, [edit]);

    async function editCourses(id, data) {
        setIsLoading(true);
        await api.put(`/courses/${id}`, data)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Curso editado com sucesso', 'success');
            setEdit(false);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar editar as informações, tente novamente!', 'error');
        });
        setIsLoading(false);
    }

    function defineEdit(course) {        
        setCourse(course);
        setEdit(true);
    }

    function returnToTable() {
        setEdit(false);
    }
      
    return (
        <div>
            {    
                (show) ?  
                (<>
                <Index></Index>
                <div className="d-flex align-items-center justify-content-center mt-2">
                    <div className="container-index">
                        {
                            (edit) ?
                                (
                                    <>
                                        <FormCourse onSubmit={editCourses} course={course}></FormCourse>
                                        <div className="d-flex flex-row align-items justify-content-center">
                                            <button onClick={returnToTable} className="btn btn-primary btnColor tam">
                                                Voltar
                                            </button>
                                        </div>
                                    </>
                                ) 
                                : 
                                (

                                    <table className="table table-bordered table-hover">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th scope="col">Nome</th>
                                                <th scope="col">Ações</th>
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
                                                    {courses.map(course => (
                                                        <tr key={course.id}>
                                                            <td>{course.name}</td>
                                                            <td>
                                                                <button onClick={() => defineEdit(course)} className="btn btn-primary btnColor">
                                                                    Editar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))} 
                                                    
                                                </tbody>
                                            )
                                        }
                                    </table>
                                )
                        }
                        
                    </div>
                </div>
                </>)
                :
                (<Index></Index>)
            }
        </div>
    );
}

export default withRouter(EditCourse);