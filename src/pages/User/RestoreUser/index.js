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
    { field: 'fullname', width: 200, headerName: 'Nome completo'},
    { field: 'username', width: 200, headerName: 'Nome de usuário'},
    { field: 'email', headerName: 'E-mail', width: 200},
    { field: 'fnc', width: 200, headerName: 'Função', valueGetter: (params) => params.getValue('function') === "adm" ? "Administrador" : "Usuário"},
    {
        field: "",
        headerName: "Ação",
        disableClickEventBubbling: true,
        renderCell: (params) => {
            return <Button onClick={() => confirmRestore(params.row)}>Reativar</Button>;
        }
    }
];

function RestoreUser({ history }) {
    const classes = useStyles();
    const MySwal = withReactContent(Swal);

    const [users, setUsers] = useState([]);
    const [deleted, setDeleted] = useState(false);
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
        retrieveUsers();
    }, [deleted]);

    async function retrieveUsers() {
        setIsLoading(true);
        await api.get("/users")
        .then(function (response) {
            const usersReceived = response.data.filter((elem) => {
                return elem.status === 'Inativo';
            });

            setUsers(usersReceived);
        })
        .catch(function (error) {
            console.log(error)
        });
        setIsLoading(false);
    }

    async function restoreUsers(id) {
        setIsLoading(true);
        await api.post(`/users/restore/${id}`)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Usuário reativado com sucesso', 'success');
            setDeleted(true);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar visualizar as informações, tente novamente!', 'error');
        });
        setIsLoading(false);
    }

    function confirmRestore(user) {
        MySwal.fire({
            title: 'Tem certeza?',
            text: "Deseja mesmo reativar esse usuário?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sim, reative!'
          }).then((result) => {
            if (result.value) {
                restoreUsers(user.id);
                setDeleted(false);
            }
        });     
    }

    return (
        <>
            {show && (<>
                <NavBar/>
                <div className={classes.main}>
                    <DataGrid loading={isLoading} autoHeight pageSize={5} localeText={localeText} rows={users} columns={columns(confirmRestore)}/>
                </div>
            </>)}
        </>
    );
}

const useStyles = makeStyles((theme) => ({
    main: {
        padding: 25
    }
}));

export default withRouter(RestoreUser)