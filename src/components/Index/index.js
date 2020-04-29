import React, { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import { Menu, Container, ContainerIndex, Header, InfoUser, Image, CampusName, UserFullname, Button, Dropbutton } from './style';
import { useHistory } from "react-router-dom";
import { logout } from "../../services/auth";
import Logo from "../../assets/logo.png";
import MenuAdm from '../MenuAdm';
import Switch from 'react-switch';
import CryptoJS from 'crypto-js';
import { ThemeContext } from 'styled-components';
import './index.css';
import { useContext } from "react";
import {store} from '../../store'
import watch from 'redux-watch';

function Index({ toggleTheme }) {
    const [userAdm, setUserAdm] = useState(false); 
    
    const [userLogged, setUserLogged] = useState([]);
    const [campusUserLogged, setCampusUserLogged] = useState([]);
    const [isLogged, setIsLogged] = useState(false);
    const [clickLogout, setClickLogout] = useState(false);
    
    const { title } = useContext(ThemeContext);
    let history = useHistory();

    let w = watch(store.getState, 'user')
    store.subscribe(w((newVal, oldVal, objectPath) => {
        const bytesU = CryptoJS.AES.decrypt(newVal, process.env.REACT_APP_KEY_USER);
        setUserLogged(JSON.parse(bytesU.toString(CryptoJS.enc.Utf8)));   
        setIsLogged(true);         
    }))

    let wa = watch(store.getState, 'campus')
    store.subscribe(wa((newVal, oldVal, objectPath) => {
        const bytesC = CryptoJS.AES.decrypt(newVal, process.env.REACT_APP_KEY_CAMPUS);
        setCampusUserLogged(JSON.parse(bytesC.toString(CryptoJS.enc.Utf8)));
    }))

    useEffect(() => {
        const redux = store.getState();
        const bytesUserLogged = CryptoJS.AES.decrypt(redux.user, process.env.REACT_APP_KEY_USER);
        const bytesCampusUserLogged = CryptoJS.AES.decrypt(redux.campus, process.env.REACT_APP_KEY_CAMPUS);
        
        try{
            const verify = JSON.parse(bytesUserLogged.toString(CryptoJS.enc.Utf8));
            
            if(typeof verify.id === 'number' && !clickLogout) {
                setIsLogged(true);                
            }
        }
        catch(error) {
            console.log(error);
            
        } 
        
        if(isLogged && !clickLogout) {            
            try{
                setUserLogged(JSON.parse(bytesUserLogged.toString(CryptoJS.enc.Utf8)));
                setCampusUserLogged(JSON.parse(bytesCampusUserLogged.toString(CryptoJS.enc.Utf8)));
            }
            catch(error) {
                console.log(error);
            }
        }        
    }, [isLogged, clickLogout])

    useEffect(() => {
        localStorage.setItem('index', JSON.stringify(isLogged));        
    }, [isLogged]);

    useEffect(() => {     
        try {
            function isAdm() {
                if(userLogged.function === 'adm') {
                    setUserAdm(true);
                }
            }
    
            isAdm();
        }
        catch(error) {
            console.log(error);   
        }
    }, [userLogged]);

    async function handleLogout(e) {
        e.preventDefault();
        setIsLogged(false);
        setClickLogout(true);
        
        logout();
        history.push("/");
    }

    return (

        <div>
            {(isLogged) && 
                <>
                    <Header>
                        <ContainerIndex>
                            <Image src={Logo} alt="Logo da UNESPAR"></Image>
                            <InfoUser>
                                <UserFullname >{(isLogged) && userLogged.fullname}</UserFullname>
                                <CampusName >{(isLogged) &&  "Campus de "+campusUserLogged.city}</CampusName>
                                <Button onClick={handleLogout}>Logout</Button>
                            </InfoUser>
                        </ContainerIndex>
                    </Header>

                    <Menu>
                        <Container>
                            <div>
                                <div className="dropdown">
                                    <Dropbutton>Novo</Dropbutton>
                                    <div className="dropdown-content ">
                                            <Link to="/schedule/new">Agendamento</Link>

                                        { userAdm && <MenuAdm value="new"></MenuAdm> }
                                    </div>
                                </div>

                                <div className="dropdown">
                                    <Dropbutton>Editar</Dropbutton>
                                    <div className="dropdown-content ">
                                        <Link to="/schedule/edit">Agendamento</Link>
                                        { userAdm && <MenuAdm value="edit"></MenuAdm> }
                                    </div>
                                </div>

                                <div className="dropdown">
                                    <Dropbutton>Excluir</Dropbutton>
                                    <div className="dropdown-content ">
                                        <Link to="/schedule/delete">Agendamento</Link>
                                        { userAdm && <MenuAdm value="delete"></MenuAdm> }
                                    </div>
                                </div>

                                <div className="dropdown">
                                    <Dropbutton>Visualizar</Dropbutton>
                                    <div className="dropdown-content">
                                        <Link to="/schedule/view">Agendamento</Link>
                                        { userAdm && <MenuAdm value="view"></MenuAdm> }
                                    </div>
                                </div>
                                {
                                    userAdm &&
                                    <div className="dropdown">
                                        <Dropbutton>Ações</Dropbutton>
                                        <div className="dropdown-content ">
                                            { userAdm && <Link to="/reports">Gráficos</Link> }
                                        </div>
                                    </div>
                                }
                            </div>
                                <Switch
                                    onChange={toggleTheme}
                                    checked={title === 'dark'}
                                    checkedIcon={false}
                                    uncheckedIcon={false}
                                    height={10}
                                    width={40}
                                    handleDiameter={20}
                                    
                                />
                        </Container>		
                    </Menu>
                </>
            }
        </div>
    );
}

export default memo(Index);