import React, { useState, useEffect } from "react";
import { DataGrid } from '@material-ui/data-grid';
import { withRouter } from 'react-router-dom';
import api from '../../../services/api';
import NavBar from "../../../components/NavBar";
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import {GRID_DEFAULT_LOCALE_TEXT as localeText} from "../../../utils/localeTextGrid"
import { useSelector } from "react-redux";
import FormPlace from "../../../components/FormPlace";

const columns = (setPlace, setEdit) => [
    { field: 'name', width: 200, headerName: 'Nome'},
    { field: 'capacity', headerName: 'Capacidade', width: 200},
    {
        field: "",
        headerName: "Ação",
        disableClickEventBubbling: true,
        renderCell: (params) => {
            const onClick = () => {
                setPlace(params.row)
                setEdit(true)
            };
        
            return <Button onClick={onClick}>Editar</Button>;
        }
    }
];

function EditPlace({ history }) {
    const classes = useStyles();
    
    const [changeOrder, setChangeOrder] = useState(false)
    const [places, setPlaces] = useState([]);
    const [place, setPlace] = useState('');
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
        retrievePlaces();
    }, [edit]);

    async function retrievePlaces() {
        setIsLoading(true);
        await api.get("/places")
        .then(function (response) {
            const placesReceived = response.data.filter((elem) => {
                return elem.status === 'Ativo';
            });

            setPlaces(placesReceived);
        })
        .catch(function (error) {
            console.log(error)
        });
        setIsLoading(false);
    }

    async function editPlaces(id, data) {
        setIsLoading(true);
        return new Promise((resolve, reject) => {
            api.put(`/places/${id}`, data)
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
                                <FormPlace onSubmit={editPlaces} place={place} showBack back={() => setEdit(false)}></FormPlace>
                            </div>
                        </div>
                    ) : (<>
                        <DataGrid loading={isLoading} autoHeight pageSize={5} localeText={localeText} rows={places} columns={columns(setPlace, setEdit)}/>
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

export default withRouter(EditPlace)