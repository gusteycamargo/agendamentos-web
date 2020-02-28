import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import api from '../../services/api'
import Logo from "../../assets/logo.png";
import { login } from "../../services/auth";
import '../../styles/global.css'
import './index.css';

function Login(props) {
    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [error, setError] = useState([]);

    async function handleLogin(e) {
        e.preventDefault();
        if (!username || !password) {
            setError("Preencha todos os campos para continuar!");
        } else {
            try {
                const response = await api.post("/sessions", { username, password });
                console.log(response);
                login(response.data.token);
                props.history.push("/schedule/new");
            } catch (err) {
                setError("Nome de usuário ou senha incorreta.");
            }
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
                    <button className="btn-login" type="submit">Login</button>
                </form>
            </div>
        </div>
        
    );
}

export default withRouter(Login);