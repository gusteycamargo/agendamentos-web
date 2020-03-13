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

function EditCourse(props) {
    const MySwal = withReactContent(Swal);
    
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState('');
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        async function retrieveCourses() {
            await api.get("/courses")
            .then(function (response) {
                setCourses(response.data);
            })
            .catch(function (error) {
                console.log(error)
                MySwal.fire('Oops...', 'Houve um tentar visualizar as informações, tente novamente!', 'error');
            });
        }

        retrieveCourses();
    }, [edit]);

    async function editCourses(id, data) {
        await api.put(`/courses/${id}`, data)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Curso editado com sucesso', 'success');
            setEdit(false);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar editar as informações, tente novamente!', 'error');
        });
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
                <>
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
                                                <th scope="col">Status</th>
                                                <th scope="col">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses.map(course => (
                                                <tr key={course.id}>
                                                    <td>{course.name}</td>
                                                    <td>{course.status}</td>
                                                    <td>
                                                        <button onClick={() => defineEdit(course)} className="btn btn-primary btnColor">
                                                            Editar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))} 
                                            
                                        </tbody>
                                    </table>
                                )
                        }
                        
                    </div>
                </div>
                </>
            }
        </div>
    );
}

export default withRouter(EditCourse);