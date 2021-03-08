import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useSelector } from 'react-redux';
import { Button, TextField, CircularProgress, FormControl, InputLabel, Grid, makeStyles, Typography } from '@material-ui/core';

function FormPlace({ onSubmit, place, back, showBack }) {
    const MySwal = withReactContent(Swal);
    const classes = useStyles();

    const [capacity, setCapacity] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const userLogged = useSelector(state => state.userLogged.userLogged);

    useEffect(() => {
        if(place){
            setName(place.name);
            setCapacity(place.capacity);
        }
    }, [place])

    function save(e) {
        e.preventDefault();
        if(!name) { MySwal.fire('Nome não preenchido', 'O campo nome deve ser preenchido!', 'error'); return }     
        if(!capacity) { MySwal.fire('Capacidade não preenchida', 'O campo capacidade deve ser preenchido!', 'error'); return }     

        setIsLoading(true);
        onSubmit(place.id, {
            name,
            capacity,
            status: 'Ativo',
            campus_id: userLogged.campus_id,
        })
        .then(function (response) {
            setIsLoading(false);
            clear()
            MySwal.fire('Prontinho', 'Sala cadastrada com sucesso!', 'success');
        })
        .catch(function (error) {
            setIsLoading(false);
            if(error?.response?.data?.error) { MySwal.fire('Oops...', error.response.data.error, 'error') }
            else { MySwal.fire('Oops...', 'Houve um erro ao cadastrar, tente novamente!', 'error') }
        });
    }

    function clear() {
        setName('');
        setCapacity('');
    }
      
    return (
        <div>
            <form onSubmit={save}>
                <FormControl variant="outlined" className={classes.formControl}>
                    <TextField 
                        id="name" 
                        label="Nome" 
                        variant="outlined" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className={classes.w100}
                    />
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>
                    <TextField 
                        id="capacity" 
                        label="Capacidade" 
                        variant="outlined" 
                        type="number"
                        value={capacity}
                        onChange={e => setCapacity(e.target.value)}
                        className={classes.w100}
                    />
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>
                    <Button type="submit" onClick={save} className={classes.buttons} variant="contained" color="primary">
                        Salvar
                        {isLoading && <CircularProgress size={18} style={{ marginLeft: 10 }} color="#FFF" />}
                    </Button>
                </FormControl>
                {showBack && (
                    <FormControl style={{ marginTop: 20 }} variant="outlined" className={classes.formControl}>
                        <Button onClick={back} className={classes.buttons} variant="contained" color="primary">
                            Voltar
                        </Button>
                    </FormControl>
                )}
            </form>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    buttons: {
      paddingTop: 15.5,
      paddingBottom: 15.5,
      paddingLeft: 14,
      paddingRight: 14,
      backgroundColor: "#042963"
    },
    w100: {
      width: '100%',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      width: '100%',
    },
}));

export default withRouter(FormPlace);