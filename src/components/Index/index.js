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

function Index({ toggleTheme }) {
    const [userAdm, setUserAdm] = useState(false); 

    const [isLogged, setIsLogged] = useState(false);
    const userLogged = useSelector(state => state.userLogged.userLogged);
    const campusUserLogged = useSelector(state => state.campus.campus);
    const dispatch = useDispatch();
    const { title } = useContext(ThemeContext);
    let history = useHistory();

    function setUserAndCampus() {
        dispatch(CampusActions.setCampus(''));
        dispatch(UserLoggedActions.setUserLogged(''));
    }

    useEffect(() => {
        console.log(userLogged);
        if(userLogged?.id) {
            setIsLogged(true)
            if(userLogged.function == 'adm') {
                setUserAdm(true)
            }
            else {
                setUserAdm(false)
            }
        }
    }, [userLogged])

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

    return (

        <div>
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
            )}
        </div>
    );
}

export default memo(Index);