import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import api from '../../services/api'
import { logout } from "../../services/auth";
import Logo from "../../assets/logo.png";
import MenuAdm from '../MenuAdm';
import './index.css';

function Index(props) {
    const [userLogged, setUserLogged] = useState({});
    const [campusUserLogged, setCampusUserLogged] = useState({});
    const [userAdm, setUserAdm] = useState(false);

    useEffect(() => {
        async function getUserLogged() {
            const response = await api.get('/userLogged');

            if(response.data.user.function === 'adm') {
                setUserAdm(true);
            }

            setUserLogged(response.data.user);
            setCampusUserLogged(response.data.campus);
        }

        getUserLogged();
    }, []);

    async function handleLogout(e) {
        e.preventDefault();
        logout();
        props.history.push("/");
    }

    return (

        <div>
            <div className="header">
                <div className="container-index">

                    <img className="img" src={Logo} alt="Logo da UNESPAR"></img>
                    <div className="logout">
                        <p className="usuario">{userLogged.fullname}</p>
                        <p className="campus">{"Campus de "+campusUserLogged.city}</p>
                        <button onClick={handleLogout} className="btn-logout">Logout</button>
                    </div>
                </div>
            </div>

            <div className="menu-items">
                <div className="container-index">
                    <div className="dropdown">
                        <a className="dropbtn">Novo</a>
                        <div className="dropdown-content ">
                            <Link to="/schedule/new">Agendamento</Link>
                            { userAdm && <MenuAdm value="new"></MenuAdm> }
                        </div>
                    </div>

                    <div className="dropdown">
                        <a className="dropbtn">Editar</a>
                        <div className="dropdown-content ">
                            <Link to="/schedule/edit">Agendamento</Link>
                            { userAdm && <MenuAdm value="edit"></MenuAdm> }
                        </div>
                    </div>

                    <div className="dropdown">
                        <a className="dropbtn">Excluir</a>
                        <div className="dropdown-content ">
                            <Link to="/schedule/delete">Agendamento</Link>
                            { userAdm && <MenuAdm value="delete"></MenuAdm> }
                        </div>
                    </div>

                    <div className="dropdown">
                        <a className="dropbtn">Visualizar</a>
                        <div className="dropdown-content">
                            <Link to="/schedule/view">Agendamento</Link>
                            { userAdm && <MenuAdm value="view"></MenuAdm> }
                        </div>
                    </div>
                </div>		
	        </div>
        </div>
    );
}

export default withRouter(Index);