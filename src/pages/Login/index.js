import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Image from "../../assets/background.png"
import Logo from "../../assets/logo.png"
import { useDispatch } from 'react-redux';
import api from '../../services/api'
import { withRouter } from "react-router-dom";
import { login, isAuthenticated } from "../../services/auth";
import * as CampusActions from '../../store/actions/campus';
import * as UserLoggedActions from '../../store/actions/userLogged';
import { FormControl, Typography, CircularProgress } from '@material-ui/core';

function Login({ history }) {
    const classes = useStyles();
    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        isLogged()
    }, [history]);

    async function isLogged() {
        await isAuthenticated()
            .then(() => history.push("/schedule/new"))
            .catch((error) => console.log(error))
    }

    function addUserAndCampus(user, campus) {
        dispatch(CampusActions.setCampus(campus));
        dispatch(UserLoggedActions.setUserLogged(user));
    }

    async function handleLogin(e) {
        e.preventDefault();
        if (!username || !password) {
            setError("Preencha todos os campos para continuar!");
        } else {
            setIsLoading(true);
            api.post("/sessions", { username, password })
            .then(async response => {
                login(response.data.token);
                await api.get('/userLogged')
                    .then(async responseUser => {
                        addUserAndCampus(responseUser.data.user, responseUser.data.campus);
                        history.push("/schedule/new");
                    })
                    .catch(error => {
                        console.log(error);
                        setError("Erro na consulta, tente novamente.");
                    })
            })
            .catch(error => {
                console.log(error);
                setError("Nome de usuário ou senha incorreta.");
            })
            .finally(() => setIsLoading(false))
            
        }
    }

    return (
        <div className={classes.background}>
            <Card className={classes.root}>
                <form className={classes.w100} onSubmit={handleLogin}>
                    <CardContent className={classes.w100}>
                        <img className={classes.image} src={Logo} alt="Unespar logo" />

                        {error && <Typography className={classes.error}>{error}</Typography>}
                        <TextField 
                            className={classes.textField} 
                            InputProps={{ className: classes.input }} 
                            id="nome de usuário" 
                            placeholder="Nome de usuário" 
                            variant="outlined" 
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                        <TextField
                            type="password" 
                            className={classes.textField} 
                            InputProps={{ className: classes.input }} 
                            id="senha" 
                            placeholder="Senha" 
                            variant="outlined" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </CardContent>
                    <CardActions className={classes.w100}>
                        <Button className={classes.buttons} onClick={handleLogin} type="submit" variant="contained" color="primary">
                            Login
                            {isLoading && <CircularProgress size={18} style={{ marginLeft: 10 }} color="#FFF" />}
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
}

const useStyles = makeStyles({
    buttons: {
        paddingTop: 15.5,
        paddingBottom: 15.5,
        paddingLeft: 14,
        paddingRight: 14,
        backgroundColor: "#042963",
        width: '70%'
    },
    error: {
        color: '#ff3333',
        marginBottom: 15,
        border: 'none',
        width: '100%',
        textAlign: 'center',
    },
    input: {
        marginBottom: 15,
        color: '#777',
        fontSize: 15,
        backgroundColor: '#fff',
    },
    textField: {
        width: '70%',
    },
    w100: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    root: {
        width: 600,
        borderRadius: 15,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d5d5d5a4',
        boxShadow: '-2px 1px 24px 1px rgba(0,0,0,0.75)'
    },
    background: {
        backgroundImage: `url(${Image})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 0,
        padding: 0,
        height: '100vh'
    },
    image: {
        width: 250,
        marginBottom: 25
    }
});

export default withRouter(Login);