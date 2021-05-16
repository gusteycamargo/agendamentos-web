import React, { useState, useEffect } from "react";
import { makeStyles, Modal, Backdrop, Fade } from "@material-ui/core";
import moment from "moment"

export default function ModalSchedule({ open, onClose, schedule }) {
    const classes = useStyles();
    const [equipamentsSelecteds, setEquipamentsSelecteds] = useState([])

    useEffect(() => {
        const array = []
        if(schedule?.equipaments?.length > 0) schedule?.equipaments.map(equipament => array.push(`${equipament.name}, `))
        setEquipamentsSelecteds(array)
    }, [schedule])

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <div className={classes.paper}>
                    <h2 id="transition-modal-title" className={classes.title}>Agendamento {moment(schedule?.date).format('DD/MM/YYYY')} - das {schedule?.initial} às {schedule?.final}</h2>
                    <p id="transition-modal-description" className={classes.sub}>Sala: {schedule?.place?.name}</p>
                    <p id="transition-modal-description" className={classes.sub}>Ano (curso): {schedule?.category?.description}</p>
                    <p id="transition-modal-description" className={classes.sub}>Curso: {schedule?.course?.name}</p>
                    <p id="transition-modal-description" className={classes.sub}>Equipamentos: {equipamentsSelecteds}</p>
                    <p id="transition-modal-description" className={classes.sub}>Solicitante: {schedule?.requesting_user?.fullname}</p>
                    <p id="transition-modal-description" className={classes.sub}>Responsável: {schedule?.registration_user?.fullname}</p>
                    {schedule?.comments && (
                        <p id="transition-modal-description" className={classes.sub}>Observações: {schedule?.comments}</p>
                    )}
                    <p id="transition-modal-description" className={classes.sub}>Status: {schedule?.status}</p>
                </div>
            </Fade>
        </Modal>
    )
}

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none', 
        margin: '20%'
    },
    paper: {
        backgroundColor: '#424242',
        // border: '2px solid #000',
        borderRadius: 10,
        outline: 'none',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    title: {
        color: '#fff',
        fontFamily: 'Arial, Sans-serif'
    },
    sub: {
        color: '#fff',
        fontFamily: 'Arial, Sans-serif'
    }
}));