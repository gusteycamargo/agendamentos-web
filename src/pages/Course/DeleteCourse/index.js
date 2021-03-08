import React, { useState, useEffect } from "react";
import { DataGrid } from '@material-ui/data-grid';
import { withRouter } from 'react-router-dom';
import api from '../../../services/api';
import NavBar from "../../../components/NavBar";
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import {GRID_DEFAULT_LOCALE_TEXT as localeText} from "../../../utils/localeTextGrid"
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const columns = (confirmDelete) => [
    { field: 'name', width: 200, headerName: 'Nome'},
    {
        field: "",
        headerName: "Ação",
        disableClickEventBubbling: true,
        renderCell: (params) => {
            return <Button onClick={() => confirmDelete(params.row)}>Excluir</Button>;
        }
    }
];

function DeleteCourse({ history }) {
    const classes = useStyles();
    const MySwal = withReactContent(Swal);

    const [courses, setCourses] = useState([]);
    const [deleted, setDeleted] = useState(false);
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const userLogged = useSelector(state => state.userLogged.userLogged);

    useEffect(() => {        
        if(userLogged.function == 'adm') {
            setShow(true);
        }
        else {
            history.push("/schedule/new");
        }
    }, [history, userLogged]);

    useEffect(() => {
        retrieveCourses();
    }, [deleted]);

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
        });
        setIsLoading(false);
    }

    async function deleteCourses(id) {
        setIsLoading(true);
        await api.delete(`/courses/${id}`)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Curso deletado com sucesso', 'success');
            setDeleted(true);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar editar as informações, tente novamente!', 'error');
        });
        setIsLoading(false);
    }

    function confirmDelete(course) {
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
                deleteCourses(course.id);
                setDeleted(false);
            }
        });     
    }

    return (
        <>
            {show && (<>
                <NavBar/>
                <div className={classes.main}>
                    <DataGrid loading={isLoading} autoHeight pageSize={5} localeText={localeText} rows={courses} columns={columns(confirmDelete)}/>
                </div>
            </>)}
        </>
    );
}

const useStyles = makeStyles((theme) => ({
    main: {
        padding: 25
    },
    rootEdit: {
        width: '50%',
    },
    edit: {
        marginTop: 35,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    root: {
      flexGrow: 1,
      marginTop: 10,
      marginBottom: 20
    },
    w100: {
        width: '100%',
    },
    center: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    formControl: {
        minWidth: 120,
        width: '100%',
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    buttons: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 14,
        paddingRight: 14,
        backgroundColor: "#042963"
      },
}));

export default withRouter(DeleteCourse)