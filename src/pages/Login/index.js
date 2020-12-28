import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import api from '../../services/api'
import Logo from "../../assets/logo.png";
import { login, isAuthenticated } from "../../services/auth";
import Spinner from 'react-activity/lib/Spinner';
import { useDispatch } from 'react-redux';
import 'react-activity/lib/Spinner/Spinner.css';
import '../../styles/global.css'
import './index.css';
import * as CampusActions from '../../store/actions/campus';
import * as UserLoggedActions from '../../store/actions/userLogged';

function Login({ history }) {
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
            await api.post("/sessions", { username, password })
            .then(async response => {
                //login(response.data.token);
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
            setIsLoading(false);
        }
      }

    return (
        <div className="container-fluid">
            <div className="background-form"> 
                <form className="form" onSubmit={handleLogin}>
                    <img className="logo" src={Logo} alt="Unespar logo" />
                    {error && <p className="error">{error}</p>}
                    <input
                    className="input"
                    type="text"
                    placeholder="Nome de usuário"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    />
                    <input
                    className="input"
                    type="password"
                    placeholder="Senha"
                    onChange={e => setPassword(e.target.value)}
                    />
                    <button className="btn-login" type="submit">
                        Login
                        <Spinner className="ml-2" color="#727981" size={16} speed={0.5} animating={isLoading} />    
                    </button>
                </form>
            </div>
        </div>
        
    );
}

export default withRouter(Login);