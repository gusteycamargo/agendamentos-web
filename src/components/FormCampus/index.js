import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Button, TextField, CircularProgress, FormControl, makeStyles, Select, MenuItem, InputLabel } from '@material-ui/core';
import axios from "axios"

function FormCampus({ onSubmit, campus, back, showBack }) {
    const MySwal = withReactContent(Swal);
    const classes = useStyles();

    const [adress, setAdress] = useState('');
    const [city, setCity] = useState('');
    const [cities, setCities] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getCities()
    }, [])
    
    useEffect(() => {
        if(campus){
            setCity(campus.city);
            setAdress(campus.adress);
        }
    }, [campus])

    function getCities() {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/41/municipios?orderBy=nome')
        .then(res => setCities(res.data))
        .catch(err => MySwal.fire('Oops', 'Erro ao recuperar lista de cidades', 'error'))
    }

    function save(e) {
        e.preventDefault();
        if(!city) { MySwal.fire('Cidade não preenchida', 'O campo cidade deve ser preenchido!', 'error'); return }     
        if(!adress) { MySwal.fire('Endereço não preenchido', 'O campo endereço deve ser preenchido!', 'error'); return }     

        setIsLoading(true);
        onSubmit(campus.id, {
            city,
            adress,
            status: "Ativo"
        })
        .then(function (response) {
            setIsLoading(false);
            clear()
            MySwal.fire('Prontinho', 'Campus cadastrado com sucesso!', 'success');       
        })
        .catch(function (error) {
            setIsLoading(false);
            if(error?.response?.data?.error) { MySwal.fire('Oops...', error.response.data.error, 'error') }
            else { MySwal.fire('Oops...', 'Houve um erro ao cadastrar, tente novamente!', 'error') }
        });
    }

    function clear() {
        setCity('');
        setAdress('');
    }
      
    return (
        <div>
            <form onSubmit={save}>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="cidade">Cidade</InputLabel>
                    <Select
                        labelId="cidade"
                        id="cidade-select"
                        value={city}
                        className={classes.w100}
                        onChange={e => setCity(e.target.value)}
                        label="Cidade"
                        required
                    >
                        {cities.map(city => (
                            <MenuItem value={city.id}>{city.nome}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>
                    <TextField 
                        id="adress" 
                        label="Endereço" 
                        variant="outlined" 
                        value={adress}
                        onChange={e => setAdress(e.target.value)}
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

export default withRouter(FormCampus);