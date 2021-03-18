import React, { useState, useEffect } from "react";
import { DataGrid } from '@material-ui/data-grid';
import { withRouter } from 'react-router-dom';
import api from '../../../services/api';
import NavBar from "../../../components/NavBar";
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import {GRID_DEFAULT_LOCALE_TEXT as localeText} from "../../../utils/localeTextGrid"
import FormUser from "../../../components/FormUser";
import { useSelector } from "react-redux";

const columns = (setUser, setEdit) => [
    { field: 'fullname', width: 200, headerName: 'Nome completo'},
    { field: 'username', width: 200, headerName: 'Nome de usuário'},
    { field: 'email', headerName: 'E-mail', width: 200},
    { field: 'fnc', width: 200, headerName: 'Função', valueGetter: (params) => params.getValue('function') === "adm" ? "Administrador" : "Usuário"},
    {
        field: "",
        headerName: "Ação",
        disableClickEventBubbling: true,
        renderCell: (params) => {
            const onClick = () => {
                setUser(params.row)
                setEdit(true)
            };
        
            return <Button onClick={onClick}>Editar</Button>;
        }
    }
];

function EditUser({ history }) {
    const classes = useStyles();
    
    const [changeOrder, setChangeOrder] = useState(false)
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState('');
    const [edit, setEdit] = useState(false);
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
    }, [edit]);

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

    async function retrieveUsers() {
        setIsLoading(true);
        await api.get("/users")
        .then(function (response) {
            const usersReceived = response.data.filter((elem) => {
                return elem.status === 'Ativo';
            });

            setUsers(usersReceived);
        })
        .catch(function (error) {
            console.log(error)
        });
        setIsLoading(false);
    }

    async function editUsers(id, data) {
        setIsLoading(true);
        return new Promise((resolve, reject) => {
            api.put(`/users/${id}`, data)
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
                                <FormUser onSubmit={editUsers} user={user} showBack back={() => setEdit(false)}></FormUser>
                            </div>
                        </div>
                    ) : (<>
                        <DataGrid loading={isLoading} autoHeight pageSize={5} localeText={localeText} rows={users} columns={columns(setUser, setEdit)}/>
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
    }
}));

export default withRouter(EditUser)