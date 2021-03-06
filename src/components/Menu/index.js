import React from 'react';
import { Link } from "react-router-dom";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function MenuItemList({userAdm, anchorEl, handleClose, url}) {
    return (
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            <Link style={{ textDecoration: 'none', color: '#313131' }} to={`/schedule/${url}`}>
                <MenuItem onClick={handleClose}>Agendamento</MenuItem>
            </Link>
            {userAdm && (<>
                <Link style={{ textDecoration: 'none', color: '#313131' }} to={`/category/${url}`}>
                    <MenuItem onClick={handleClose}>Ano (curso)</MenuItem>
                </Link>
                <Link style={{ textDecoration: 'none', color: '#313131' }} to={`/campus/${url}`}>
                    <MenuItem onClick={handleClose}>Campus</MenuItem>
                </Link>
                <Link style={{ textDecoration: 'none', color: '#313131' }} to={`/course/${url}`}>
                    <MenuItem onClick={handleClose}>Curso</MenuItem>
                </Link>
                <Link style={{ textDecoration: 'none', color: '#313131' }} to={`/equipament/${url}`}>
                    <MenuItem onClick={handleClose}>Equipamento</MenuItem>
                </Link>
                <Link style={{ textDecoration: 'none', color: '#313131' }} to={`/place/${url}`}>
                    <MenuItem onClick={handleClose}>Sala</MenuItem>
                </Link>
                <Link style={{ textDecoration: 'none', color: '#313131' }} to={`/user/${url}`}>
                    <MenuItem onClick={handleClose}>Usuário</MenuItem>
                </Link>
            </>)}
        </Menu>
    )
}