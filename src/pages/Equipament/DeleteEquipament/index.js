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
    { field: 'brand', width: 200, headerName: 'Marca'},
    { field: 'equityNumber', width: 200, headerName: 'Número de patrimônio'},
    {
        field: "",
        headerName: "Ação",
        disableClickEventBubbling: true,
        renderCell: (params) => {
            return <Button onClick={() => confirmDelete(params.row)}>Excluir</Button>;
        }
    }
];

function DeleteEquipament({ history }) {
    const classes = useStyles();
    const MySwal = withReactContent(Swal);

    const [equipaments, setEquipaments] = useState([]);
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
        retrieveEquipaments();
    }, [deleted]);

    async function retrieveEquipaments() {
        setIsLoading(true);
        await api.get("/equipaments")
        .then(function (response) {
            const equipamentsReceived = response.data.filter((elem) => {
                return elem.status === 'Ativo';
            });

            setEquipaments(equipamentsReceived);
        })
        .catch(function (error) {
            console.log(error)
        });
        setIsLoading(false);
    }

    async function deleteEquipaments(id) {
        setIsLoading(true);
        await api.delete(`/equipaments/${id}`)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Equipamento deletado com sucesso', 'success');
            setDeleted(true);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar editar as informações, tente novamente!', 'error');
        });
        setIsLoading(false);
    }

    function confirmDelete(equipament) {
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
                deleteEquipaments(equipament.id);
                setDeleted(false);
            }
        });     
    }

    return (
        <>
            {show && (<>
                <NavBar/>
                <div className={classes.main}>
                    <DataGrid loading={isLoading} autoHeight pageSize={5} localeText={localeText} rows={equipaments} columns={columns(confirmDelete)}/>
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
}));

export default withRouter(DeleteEquipament)