import React, { useEffect, useState, useContext, memo } from "react";
import { Link } from "react-router-dom";
import { Menu, Container, ContainerIndex, Header, InfoUser, Image, CampusName, UserFullname, Button, Dropbutton } from './style';
import { useHistory } from "react-router-dom";
import { logout } from "../../services/auth";
import Logo from "../../assets/logo.png";
import MenuAdm from '../MenuAdm';
import Switch from 'react-switch';
import { ThemeContext } from 'styled-components';
import './index.css';
import { useDispatch, useSelector } from "react-redux";
import * as UserLoggedActions from '../../store/actions/userLogged';
import * as CampusActions from '../../store/actions/campus';
import api from "../../services/api";

function Index({ toggleTheme }) {
    const [userAdm, setUserAdm] = useState(false); 

    const [isLogged, setIsLogged] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false)
    const userLogged = useSelector(state => state.userLogged.userLogged);
    const campusUserLogged = useSelector(state => state.campus.campus);
    const [hambMenu, setHambMenu] = useState(false)
    const dispatch = useDispatch();
    const { title } = useContext(ThemeContext);
    let history = useHistory();

    function setUserAndCampus() {
        dispatch(CampusActions.setCampus(''));
        dispatch(UserLoggedActions.setUserLogged(''));
    }

    useEffect(() => {
        verifyIfIsLogged()
    }, [userLogged])

    async function verifyIfIsLogged() {
        await api.get('/userLogged')
        .then(response => {
            if(userLogged?.id) {
                setIsLogged(true)
                if(userLogged.function == 'adm') {
                    setUserAdm(true)
                }
                else {
                    setUserAdm(false)
                }
            }
        })
        .catch(error => {
            logout()
        })
    }

    useEffect(() => {
        localStorage.setItem('index', JSON.stringify(isLogged));        
    }, [isLogged]);

    async function handleLogout(e) {
        e.preventDefault();
        setUserAndCampus()
        setIsLogged(false);
        
        await logout()
        .then(() => history.push("/"))
        .catch(() => handleLogout(e))        
    }

    function showMenu(x) {
        if (x.matches) { // If media query matches
            if(!hambMenu) {
                setHambMenu(true)
            }
        }
        else {
            if(hambMenu) {
                setHambMenu(false)
                setOpenDrawer(false)
            }
        }
    }
    
    const x = window.matchMedia("(max-width: 460px)")
    showMenu(x) // Call listener function at run time
    x.addListener(showMenu) // Attach listener function on state changes
      
    function renderOptions(column, mb) {
        return(
            <>
                <div className={column ? "columnDrawer" : ""}>
                    <div className={`${mb ? "mb12" : ""} dropdown`}>
                        <Dropbutton>Novo</Dropbutton>
                        <div className="dropdown-content ">
                                <Link onClick={() => setOpenDrawer(false)} to="/schedule/new">Agendamento</Link>

                            { userAdm && <MenuAdm closeDrawer={() => setOpenDrawer(false)} value="new"></MenuAdm> }
                        </div>
                    </div>

                    <div className={`${mb ? "mb12" : ""} dropdown`}>
                        <Dropbutton>Editar</Dropbutton>
                        <div className="dropdown-content ">
                            <Link onClick={() => setOpenDrawer(false)} to="/schedule/edit">Agendamento</Link>
                            { userAdm && <MenuAdm closeDrawer={() => setOpenDrawer(false)} value="edit"></MenuAdm> }
                        </div>
                    </div>

                    <div className={`${mb ? "mb12" : ""} dropdown`}>
                        <Dropbutton>Excluir</Dropbutton>
                        <div className="dropdown-content ">
                            <Link onClick={() => setOpenDrawer(false)} to="/schedule/delete">Agendamento</Link>
                            { userAdm && <MenuAdm closeDrawer={() => setOpenDrawer(false)} value="delete"></MenuAdm> }
                        </div>
                    </div>

                    <div className={`${mb ? "mb12" : ""} dropdown`}>
                        <Dropbutton>Visualizar</Dropbutton>
                        <div className="dropdown-content">
                            <Link onClick={() => setOpenDrawer(false)} to="/schedule/view">Agendamento</Link>
                            { userAdm && <MenuAdm closeDrawer={() => setOpenDrawer(false)} value="view"></MenuAdm> }
                        </div>
                    </div>
                    {
                        userAdm &&
                        <div className={`${mb ? "mb12" : ""} dropdown`}>
                            <Dropbutton>Ações</Dropbutton>
                            <div className="dropdown-content ">
                                { userAdm && <Link onClick={() => setOpenDrawer(false)} to="/reports">Gráficos</Link> }
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
            </>
        )
    }


    return (

        <div>
            <>
                {openDrawer && (
                    <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#042963', zIndex: 10, padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => setOpenDrawer(false)} className="btnHamb">
                                <i className="fas fa-times white"/>
                            </button>
                        </div>

                        {renderOptions(true, true)}
                    </div>
                )}
                {(isLogged) && ( 
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
                                {!hambMenu ? (
                                    <>
                                        {renderOptions()} 
                                    </>
                                ) : (
                                    <button onClick={() => setOpenDrawer(true)} className="btnHamb">
                                        <i className="fas fa-bars white"/>
                                    </button>
                                )}
                            </Container>		
                        </Menu>
                        
                    </>
                )}
            </>
        </div>
    );
}

export default memo(Index);