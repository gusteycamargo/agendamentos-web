import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Button, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Logo from '../../assets/logo-branco.png'
import { logout } from '../../services/auth';
import * as UserLoggedActions from '../../store/actions/userLogged';
import * as CampusActions from '../../store/actions/campus';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import api from '../../services/api';
import MenuItemList from "../Menu"
import { ExpandLess, ExpandMore, Add, Create, Apps, RestoreFromTrash, Assessment, Visibility, Schedule, AccountBalance, LibraryBooks, LaptopChromebook, Room, PeopleAlt, Delete } from '@material-ui/icons';
import Collapse from '@material-ui/core/Collapse';

function NavBar() {
  const classes = useStyles();
  let history = useHistory();

  const [state, setState] = useState({ left: false });
  const [userAdm, setUserAdm] = useState(false); 
  const [showDrawer, setShowDrawer] = useState(false); 
  const [isLogged, setIsLogged] = useState(false);
  const [url, setUrl] = useState('')
  const [anchorEl, setAnchorEl] = useState(null);

  const userLogged = useSelector(state => state.userLogged.userLogged);
  const campusUserLogged = useSelector(state => state.campus.campus);
  const dispatch = useDispatch();

  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openRestore, setOpenRestore] = useState(false);
  const [openView, setOpenView] = useState(false);

  const handleClick = (event, url) => {
    setAnchorEl(event.currentTarget);
    setUrl(url)
  };
  const handleClose = () => { setAnchorEl(null) };

  function setUserAndCampus() {
    dispatch(CampusActions.setCampus(''));
    dispatch(UserLoggedActions.setUserLogged(''));
  }

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return

    setState({ ...state, [anchor]: open });
  };

  useEffect(() => {
    verifyIfIsLogged()
  }, [userLogged])

  async function verifyIfIsLogged() {
    await api.get('/userLogged')
    .then(response => {
        if(userLogged?.id) {
            setIsLogged(true)
            if(userLogged.function === 'adm') {
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

  async function handleLogout(e) {
    e.preventDefault();
    setUserAndCampus()
    
    await logout()
    .then(() => history.push("/"))
    .catch(() => handleLogout(e))        
  }

  function showMenu(x) {
    if (x.matches) { // If media query matches
        if(!showDrawer) {
          setShowDrawer(true)
        }
    }
    else {
        if(showDrawer) {
          setShowDrawer(false)
        }
    }
  }

  const x = window.matchMedia("(max-width: 750px)")
  showMenu(x) // Call listener function at run time
  x.addListener(showMenu) // Attach listener function on state changes

  function listDrawer(url) {
    return (<>
      {url !== "restore" && 
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <Schedule />
            </ListItemIcon>
            <ListItemText onClick={() => history.push(`/schedule/${url}`)} primary="Agendamento" />
          </ListItem>
        </List>
      }

      {userAdm && (<>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <Apps />
            </ListItemIcon>
            <ListItemText onClick={() => history.push(`/category/${url}`)} primary="Ano (curso)" />
          </ListItem>
        </List>

        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <AccountBalance />
            </ListItemIcon>
            <ListItemText onClick={() => history.push(`/campus/${url}`)} primary="Campus" />
          </ListItem>
        </List>

        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <LibraryBooks />
            </ListItemIcon>
            <ListItemText onClick={() => history.push(`/course/${url}`)} primary="Curso" />
          </ListItem>
        </List>

        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <LaptopChromebook />
            </ListItemIcon>
            <ListItemText onClick={() => history.push(`/equipament/${url}`)} primary="Equipamento" />
          </ListItem>
        </List>

        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <Room />
            </ListItemIcon>
            <ListItemText onClick={() => history.push(`/place/${url}`)} primary="Sala" />
          </ListItem>
        </List>

        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <PeopleAlt />
            </ListItemIcon>
            <ListItemText onClick={() => history.push(`/user/${url}`)} primary="Usuário" />
          </ListItem>
        </List>
      </>)}
    </>)
  }

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      //onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem button onClick={() => setOpenNew(!openNew)}>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText primary="Novo" />
          {openNew ? <ExpandLess className={classes.nested} /> : <ExpandMore className={classes.nested}/>}
        </ListItem>
        <Collapse in={openNew} timeout="auto" unmountOnExit>
          {listDrawer('new')}
        </Collapse>

        <ListItem button onClick={() => setOpenEdit(!openEdit)}>
          <ListItemIcon>
            <Create />
          </ListItemIcon>
          <ListItemText primary="Editar" />
          {openEdit ? <ExpandLess className={classes.nested} /> : <ExpandMore className={classes.nested} />}
        </ListItem>
        <Collapse in={openEdit} timeout="auto" unmountOnExit>
          {listDrawer('edit')}
        </Collapse>

        <ListItem button onClick={() => setOpenDelete(!openDelete)}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText primary="Excluir" />
          {openDelete ? <ExpandLess className={classes.nested} /> : <ExpandMore className={classes.nested} />}
        </ListItem>
        <Collapse in={openDelete} timeout="auto" unmountOnExit>
          {listDrawer('delete')}
        </Collapse>

        {userAdm && <>
          <ListItem button onClick={() => setOpenRestore(!openRestore)}>
            <ListItemIcon>
              <RestoreFromTrash />
            </ListItemIcon>
            <ListItemText primary="Reativar" />
            {openRestore ? <ExpandLess className={classes.nested} /> : <ExpandMore className={classes.nested} />}
          </ListItem>
          <Collapse in={openRestore} timeout="auto" unmountOnExit>
            {listDrawer('restore')}
          </Collapse>
        </>}

        <ListItem button onClick={() => setOpenView(!openView)}>
          <ListItemIcon>
            <Visibility />
          </ListItemIcon>
          <ListItemText primary="Visualizar" />
          {openView ? <ExpandLess className={classes.nested} /> : <ExpandMore className={classes.nested} />}
        </ListItem>
        <Collapse in={openView} timeout="auto" unmountOnExit>
          {listDrawer('view')}
        </Collapse>

        {userAdm &&
          <List component="div" disablePadding>
            <ListItem button>
              <ListItemIcon>
                <Assessment />
              </ListItemIcon>
              <ListItemText onClick={() => history.push(`/reports`)} primary="Gráficos" />
            </ListItem>
          </List>
        }
      </List>
    </div>
  );

  return (<>
    <Drawer anchor={"left"} open={state["left"]} onClose={toggleDrawer("left", false)}>
      {list("left")}
    </Drawer>

    <MenuItemList anchorEl={anchorEl} handleClose={handleClose} url={url} userAdm={userAdm}/>

    <div className={classes.root}>
      <AppBar className={classes.nav} position="static">
        <Toolbar>
         {showDrawer && (
            <IconButton onClick={toggleDrawer("left", true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
         )}
          <div>
            <img className={classes.image} src={Logo} alt="Logo da UNESPAR"/>
          </div>
          <div className={classes.containerButtons}>
            {!showDrawer && (<>
              <div>
                <Button style={{ marginRight: 10, color: '#FFF' }} aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => handleClick(e, 'new')}>
                  Novo
                </Button>
              </div>

              <div>
                <Button style={{ marginRight: 10, color: '#FFF' }} aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => handleClick(e, 'edit')}>
                  Editar
                </Button>
              </div>

              <div>
                <Button style={{ marginRight: 10, color: '#FFF' }} aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => handleClick(e, 'delete')}>
                  Excluir
                </Button>
              </div>

              {userAdm && 
                <div>
                  <Button style={{ marginRight: 10, color: '#FFF' }} aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => handleClick(e, 'restore')}>
                    Reativar
                  </Button>
                </div>
              }

              <div>
                <Button style={{ marginRight: 10, color: '#FFF' }} aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => handleClick(e, 'view')}>
                  Visualizar
                </Button>
              </div>

              {userAdm && (
                <div>
                  <Button style={{ marginRight: 10, color: '#FFF' }} aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => history.push('/reports')}>
                    Gráficos
                  </Button>
                </div>
              )}
            </>)}
          </div>
          <div className={classes.column}>
            <Typography>{(isLogged) && userLogged.fullname}</Typography>
            <Typography style={{ fontWeight: 'bold' }}>{(isLogged) &&  "Campus de "+campusUserLogged.city}</Typography>
            <Button color="inherit" onClick={handleLogout}>Sair</Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  </>);
}

const useStyles = makeStyles((theme) => ({
  image: {
    height: 70,
  },
  nav: {
    backgroundColor: "#042963"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5
  },
  containerButtons: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 25
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default NavBar;
