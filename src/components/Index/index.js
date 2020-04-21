import React, { useEffect, useState, memo } from "react";
import { Link, withRouter } from "react-router-dom";
import { logout } from "../../services/auth";
import Logo from "../../assets/logo.png";
import MenuAdm from '../MenuAdm';
import { useSelector } from 'react-redux';
import CryptoJS from 'crypto-js';
import './index.css';

function Index(props) {
    const [userAdm, setUserAdm] = useState(false);
    
    const bytesUserLogged = CryptoJS.AES.decrypt(useSelector(state => state.user), '~insira a chave aqui~');
    const userLogged = JSON.parse(bytesUserLogged.toString(CryptoJS.enc.Utf8));

    const bytesCampusUserLogged = CryptoJS.AES.decrypt(useSelector(state => state.campus), '~insira a chave aqui~');
    const campusUserLogged = JSON.parse(bytesCampusUserLogged.toString(CryptoJS.enc.Utf8));

    useEffect(() => {     
        function isAdm() {
            if(userLogged.function === 'adm') {
                setUserAdm(true);
            }
        }

        isAdm();
    }, [userLogged]);

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
                        <div className="dropbtn item">Novo</div>
                        <div className="dropdown-content ">
                            <Link to="/schedule/new">Agendamento</Link>
                            { userAdm && <MenuAdm value="new"></MenuAdm> }
                        </div>
                    </div>

                    <div className="dropdown">
                        <div className="dropbtn item">Editar</div>
                        <div className="dropdown-content ">
                            <Link to="/schedule/edit">Agendamento</Link>
                            { userAdm && <MenuAdm value="edit"></MenuAdm> }
                        </div>
                    </div>

                    <div className="dropdown">
                        <div className="dropbtn item">Excluir</div>
                        <div className="dropdown-content ">
                            <Link to="/schedule/delete">Agendamento</Link>
                            { userAdm && <MenuAdm value="delete"></MenuAdm> }
                        </div>
                    </div>

                    <div className="dropdown">
                        <div className="dropbtn item">Visualizar</div>
                        <div className="dropdown-content">
                            <Link to="/schedule/view">Agendamento</Link>
                            { userAdm && <MenuAdm value="view"></MenuAdm> }
                        </div>
                    </div>
                    {
                        userAdm &&
                        <div className="dropdown">
                            <div className="dropbtn item">Ações</div>
                            <div className="dropdown-content ">
                                { userAdm && <Link to="/reports">Gráficos</Link> }
                            </div>
                        </div>
                    }
                </div>		
	        </div>
        </div>
    );
}

export default memo(withRouter(Index));