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
    { field: 'brand', width: 200, headerName: 'Marca'},
    { field: 'equityNumber', width: 200, headerName: 'Número de patrimônio'},
    { field: 'status', width: 200, headerName: 'Status'},
];

function ViewEquipament({ history }) {
    const classes = useStyles();

    const [equipaments, setEquipaments] = useState([]);
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
        retrieveEquipaments();
    }, []);    

    async function retrieveEquipaments() {
        setIsLoading(true);
        await api.get("/equipaments")
        .then(function (response) {
            setEquipaments(response.data);
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
                    <DataGrid loading={isLoading} autoHeight pageSize={5} localeText={localeText} rows={equipaments} columns={columns}/>
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

export default withRouter(ViewEquipament)