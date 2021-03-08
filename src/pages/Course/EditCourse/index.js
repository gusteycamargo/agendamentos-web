import React, { useState, useEffect } from "react";
import { DataGrid } from '@material-ui/data-grid';
import { withRouter } from 'react-router-dom';
import api from '../../../services/api';
import NavBar from "../../../components/NavBar";
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import {GRID_DEFAULT_LOCALE_TEXT as localeText} from "../../../utils/localeTextGrid"
import { useSelector } from "react-redux";
import FormCourse from "../../../components/FormCourse";

const columns = (setCourse, setEdit) => [
    { field: 'name', width: 200, headerName: 'Nome'},
    {
        field: "",
        headerName: "Ação",
        disableClickEventBubbling: true,
        renderCell: (params) => {
            const onClick = () => {
                setCourse(params.row)
                setEdit(true)
            };
        
            return <Button onClick={onClick}>Editar</Button>;
        }
    }
];

function EditCourse({ history }) {
    const classes = useStyles();
    
    const [changeOrder, setChangeOrder] = useState(false)
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState('');
    const [edit, setEdit] = useState(false);
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const userLogged = useSelector(state => state.userLogged.userLogged);

    function showMenu(x) {
        if (x.matches) { // If media query matches
            if(!changeOrder) setChangeOrder(true)
        }
        else {
            if(changeOrder) setChangeOrder(false)
        }
    }
    
    const x = window.matchMedia("(max-width: 700px)")
    showMenu(x) // Call listener function at run time
    x.addListener(showMenu) // Attach listener function on state changes

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
    }, [edit]);

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

    async function editCourses(id, data) {
        setIsLoading(true);
        return new Promise((resolve, reject) => {
            api.put(`/courses/${id}`, data)
            .then(resolve)
            .then(() => setEdit(false))
            .catch(reject)
            .finally(() => setIsLoading(false))
        })
    }

    return (
        <>
            {show && (<>
                <NavBar/>
                <div className={classes.main}>
                    {edit ? (
                        <div className={classes.edit}>
                            <div className={classes.rootEdit}>
                                <FormCourse onSubmit={editCourses} course={course} showBack back={() => setEdit(false)}></FormCourse>
                            </div>
                        </div>
                    ) : (<>
                        <DataGrid loading={isLoading} autoHeight pageSize={5} localeText={localeText} rows={courses} columns={columns(setCourse, setEdit)}/>
                    </>)}
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
}));

export default withRouter(EditCourse)