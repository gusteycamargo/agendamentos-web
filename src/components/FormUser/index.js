import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Button, TextField, CircularProgress, FormControl, Select, MenuItem, InputLabel, makeStyles } from '@material-ui/core';
import api from "../../services/api";

function FormUser({ onSubmit, user, showBack, back }) {
    const MySwal = withReactContent(Swal);
    const classes = useStyles();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [password, setPassword] = useState('');
    const [campus, setCampus] = useState('');
    const [campuses, setCampuses] = useState([]);
    const [func, setFunc] = useState([]);
    const [funcUser, setFuncUser] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        defineCampuses();
        defineFunctions();

        if(user){
            setEmail(user.email);
            setUsername(user.username);
            setFullname(user.fullname);
            setCampus(user.campus);
            setFuncUser(user.function);
        }
    }, [user])

    async function defineCampuses() {
        const response = await api.get("/campuses");
        setCampuses(response.data); 
    }

    function defineFunctions(){
        setFunc([{ value: "adm", label: "Administrador"}, { value: "user", label: "Usuário"}]);
    }

    async function save(e) {
        e.preventDefault();
        if(!email) { MySwal.fire('E-mail não preenchido', 'O campo e-mail deve ser preenchido!', 'error'); return }     
        if(!fullname) { MySwal.fire('Nome completo não preenchido', 'O campo nome completo deve ser preenchido!', 'error'); return }     
        if(!username) { MySwal.fire('Nome de usuário não preenchido', 'O campo nome de usuário deve ser preenchido!', 'error'); return }     
        if(!password) { MySwal.fire('Senha não preenchida', 'O campo senha deve ser preenchido!', 'error'); return }     
        if(!funcUser) { MySwal.fire('Função do usuário não preenchida', 'O campo função do usuário deve ser preenchido!', 'error'); return }     
        if(!campus) { MySwal.fire('Campus não preenchido', 'O campo campus deve ser preenchido!', 'error'); return }     

        setIsLoading(true);
        await onSubmit(user.id, {
            username,
            password,
            email,
            fullname,
            function: funcUser,
            status: 'Ativo',
            campus_id: campus,                
        })
        .then(function (response) {
            clear()
            setIsLoading(false);
            MySwal.fire('Prontinho', 'Usuário cadastrado com sucesso!', 'success');
        })
        .catch(function (error) {
            console.log(error);
            setIsLoading(false);
            if(error?.response?.data?.error) { MySwal.fire('Oops...', error.response.data.error, 'error') }
            else { MySwal.fire('Oops...', 'Houve um erro ao cadastrar, tente novamente!', 'error') }
        });
        
    }

    function clear() {
        setEmail('');
        setFullname('');
        setUsername('');
        setPassword('');
        setCampus('');
        setFuncUser('');
    }

    return (
        <div>
            <form onSubmit={save}>
                <FormControl variant="outlined" className={classes.formControl}>
                    <TextField 
                        id="email" 
                        label="E-mail" 
                        required
                        variant="outlined" 
                        value={email}
                        type="email"
                        onChange={e => setEmail(e.target.value)}
                        className={classes.w100}
                    />
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>
                    <TextField 
                        id="fullname" 
                        label="Nome completo" 
                        required
                        variant="outlined" 
                        value={fullname}
                        onChange={e => setFullname(e.target.value)}
                        className={classes.w100}
                    />
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>
                    <TextField 
                        id="username" 
                        required
                        label="Nome de usuário" 
                        variant="outlined" 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className={classes.w100}
                    />
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>
                    <TextField 
                        id="password" 
                        required
                        label="Senha" 
                        variant="outlined" 
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className={classes.w100}
                    />
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="funcUser">Função do usuário</InputLabel>
                    <Select
                        labelId="funcUser"
                        id="funcUser-select"
                        required
                        value={funcUser}
                        className={classes.w100}
                        onChange={e => setFuncUser(e.target.value)}
                        label="Função do usuário"
                    >
                        {func.map(func => (
                            <MenuItem value={func.value}>{func.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="campus">Campus</InputLabel>
                    <Select
                        labelId="campus"
                        required
                        id="campus-select"
                        value={campus}
                        className={classes.w100}
                        onChange={e => setCampus(e.target.value)}
                        label="Campus"
                    >
                        {campuses.map(campus => (
                            <MenuItem value={campus.id}>{campus.city}</MenuItem>
                        ))}
                    </Select>
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

export default withRouter(FormUser);