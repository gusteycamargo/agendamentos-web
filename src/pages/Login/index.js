import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import api from '../../services/api'
import Logo from "../../assets/logo.png";
import { login } from "../../services/auth";
import Spinner from 'react-activity/lib/Spinner';
import 'react-activity/lib/Spinner/Spinner.css';
import '../../styles/global.css'
import './index.css';

function Login(props) {
    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        if (!username || !password) {
            setError("Preencha todos os campos para continuar!");
        } else {
            try {
                setIsLoading(true);
                const response = await api.post("/sessions", { username, password });
                console.log(response);
                login(response.data.token);
                props.history.push("/schedule/new");
            } catch (err) {
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