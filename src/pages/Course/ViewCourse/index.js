import React, { useState, useEffect } from "react";
import { DataGrid } from '@material-ui/data-grid';
import { withRouter } from 'react-router-dom';
import api from '../../../services/api';
import NavBar from "../../../components/NavBar";
import { makeStyles } from '@material-ui/core/styles';
import {GRID_DEFAULT_LOCALE_TEXT as localeText} from "../../../utils/localeTextGrid"
import { useSelector } from "react-redux";

const columns = [
    { field: 'name', width: 200, headerName: 'Nome'},
    { field: 'status', width: 200, headerName: 'Status'},
];

function ViewCourse({ history }) {
    const classes = useStyles();

    const [show, setShow] = useState(false);
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const userLogged = useSelector(state => state.userLogged.userLogged);

    useEffect(() => {        
        if(userLogged.function === 'adm') {
            setShow(true);
        }
        else {
            history.push("/schedule/new");
        }
    }, [history, userLogged]);

    useEffect(() => {
        retrieveCourses();
    }, []);    

    async function retrieveCourses() {
        setIsLoading(true);
        await api.get("/courses")
        .then(function (response) {
            setCourses(response.data);
        })
        .catch(function (error) {
            console.log(error)
        });
        setIsLoading(false);
    }

    return (
        <>
            {show && (<>
                <NavBar/>
                <div className={classes.main}>
                    <DataGrid loading={isLoading} autoHeight pageSize={5} localeText={localeText} rows={courses} columns={columns}/>
                </div>
            </>)}
        </>
    );
}

const useStyles = makeStyles((theme) => ({
    main: {
        padding: 25
    },
}));

export default withRouter(ViewCourse)