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

const columns = (confirmRestore) => [
    { field: 'name', width: 200, headerName: 'Nome'},
    { field: 'capacity', width: 200, headerName: 'Capacidade'},
    {
        field: "",
        headerName: "Ação",
        disableClickEventBubbling: true,
        renderCell: (params) => {
            return <Button onClick={() => confirmRestore(params.row)}>Reativar</Button>;
        }
    }
];

function RestorePlace({ history }) {
    const classes = useStyles();
    const MySwal = withReactContent(Swal);

    const [places, setPlaces] = useState([]);
    const [restored, setRestored] = useState(false);
    const [show, setShow] = useState(false);
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
        retrievePlaces();
    }, [restored]);

    async function retrievePlaces() {
        setIsLoading(true);
        await api.get("/places")
        .then(function (response) {
            const placesReceived = response.data.filter((elem) => {
                return elem.status === 'Inativo';
            });

            setPlaces(placesReceived);
        })
        .catch(function (error) {
            console.log(error)
        });
        setIsLoading(false);
    }

    async function restorePlaces(id) {
        setIsLoading(true);
        await api.post(`/places/restore/${id}`)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Sala reativada com sucesso', 'success');
            setRestored(true);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar editar as informações, tente novamente!', 'error');
        });
        setIsLoading(false);
    }

    function confirmRestore(place) {
        MySwal.fire({
            title: 'Tem certeza?',
            text: "Deseja mesmo reativar essa sala?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sim, reative!'
          }).then((result) => {
            if (result.value) {
                restorePlaces(place.id);
                setRestored(false);
            }
        });     
    }  

    return (
        <>
            {show && (<>
                <NavBar/>
                <div className={classes.main}>
                    <DataGrid loading={isLoading} autoHeight pageSize={5} localeText={localeText} rows={places} columns={columns(confirmRestore)}/>
                </div>
            </>)}
        </>
    );
}

const useStyles = makeStyles((theme) => ({
    main: {
        padding: 25
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

export default withRouter(RestorePlace)