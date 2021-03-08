import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useSelector } from 'react-redux';
import { Button, TextField, CircularProgress, FormControl, InputLabel, Grid, makeStyles, Typography } from '@material-ui/core';

function FormEquipament({ onSubmit, equipament, back, showBack }) {
    const MySwal = withReactContent(Swal);
    const classes = useStyles();

    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [equityNumber, setEquityNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const userLogged = useSelector(state => state.userLogged.userLogged);

    useEffect(() => {
        if(equipament){
            setName(equipament.name);
            setBrand(equipament.brand);
            setEquityNumber(equipament.equityNumber);
        }
    }, [equipament])

    function save(e) {
        e.preventDefault();
        if(!name) { MySwal.fire('Nome não preenchido', 'O campo nome deve ser preenchido!', 'error'); return }     
        if(!brand) { MySwal.fire('Marca não preenchida', 'O campo marca deve ser preenchido!', 'error'); return }     
        if(!equityNumber) { MySwal.fire('Número de patrimônio não preenchido', 'O campo número de patrimônio deve ser preenchido!', 'error'); return }     

        setIsLoading(true);
        onSubmit(equipament.id, {
            name,
            brand,
            equityNumber,
            status: 'Ativo',
            campus_id: userLogged.campus_id,
        })
        .then(function (response) {
            setIsLoading(false);
            clear()
            MySwal.fire('Prontinho', 'Equipamento cadastrado com sucesso!', 'success');
        })
        .catch(function (error) {
            setIsLoading(false);
            if(error?.response?.data?.error) { MySwal.fire('Oops...', error.response.data.error, 'error') }
            else { MySwal.fire('Oops...', 'Houve um erro ao cadastrar, tente novamente!', 'error') }
        });
        
    }

    function clear() {
        setName('');
        setBrand('');
        setEquityNumber('');
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
                        id="brand" 
                        label="Marca" 
                        variant="outlined" 
                        value={brand}
                        onChange={e => setBrand(e.target.value)}
                        className={classes.w100}
                    />
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>
                    <TextField 
                        id="equityNumber" 
                        label="Número de patrimônio" 
                        variant="outlined" 
                        value={equityNumber}
                        onChange={e => setEquityNumber(e.target.value)}
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

export default withRouter(FormEquipament);