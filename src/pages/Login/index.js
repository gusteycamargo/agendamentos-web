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

function Login({ history }) {
    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {    
        if(isAuthenticated()) {
            history.push("/schedule/new");
        }
    }, [history]);

    function addUserLoggedAction(user) {
        return { type: 'ADD_USER_LOGGED', user }
    }

    function addCampusAction(campus) {
        return { type: 'ADD_CAMPUS', campus }
    }

    function addUserAndCampus(user, campus) {
      dispatch(addUserLoggedAction(user));
      dispatch(addCampusAction(campus));
    }

    async function handleLogin(e) {
        e.preventDefault();
        if (!username || !password) {
            setError("Preencha todos os campos para continuar!");
        } else {
            try {
                setIsLoading(true);
                const response = await api.post("/sessions", { username, password });
                login(response.data.token);
                const responseUser = await api.get('/userLogged');
                addUserAndCampus(responseUser.data.user, responseUser.data.campus);

                history.push("/schedule/new");
            } catch (err) {
                console.log(err);
                
                setError("Nome de usuário ou senha incorreta.");
            }
            setIsLoading(false);
        }
      }

    return (
        <div className="container-fluid">
            <div className="background-form"> 
                <form className="form" onSubmit={handleLogin}>
                    <img className="logo" src={Logo} alt="Airbnb logo" />
                    {error && <p className="error">{error}</p>}

                    {/* {this.state.error && <p>{this.state.error}</p>} */}
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