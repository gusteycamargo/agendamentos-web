import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useSelector } from 'react-redux';
import { Button, TextField, CircularProgress, FormControl, InputLabel, Grid, makeStyles, Typography } from '@material-ui/core';

function FormCourse({ onSubmit, course, back, showBack }) {
    const MySwal = withReactContent(Swal);
    const classes = useStyles();

    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const userLogged = useSelector(state => state.userLogged.userLogged);

    useEffect(() => {
        if(course) setName(course.name);
    }, [course])

    function save(e) {
        e.preventDefault();
        if(!name) { MySwal.fire('Nome não preenchido', 'O campo nome deve ser preenchido!', 'error'); return }     

        setIsLoading(true);
        onSubmit(course.id, {
            name,
            status: 'Ativo',
            campus_id: userLogged.campus_id,
        })
        .then(function (response) {
            setIsLoading(false);
            setName('');
            MySwal.fire('Prontinho', 'Curso cadastrado com sucesso!', 'success');
        })
        .catch(function (error) {
            setIsLoading(false);
            if(error?.response?.data?.error) { MySwal.fire('Oops...', error.response.data.error, 'error') }
            else { MySwal.fire('Oops...', 'Houve um erro ao cadastrar, tente novamente!', 'error') }
        }); 
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

export default withRouter(FormCourse);