import React from 'react';
import { Link } from 'react-router-dom';

function MenuAdm({ value, closeDrawer }) {
    const category = `/category/${value}`;
    const campus = `/campus/${value}`;
    const course = `/course/${value}`;
    const place = `/place/${value}`;
    const equipament = `/equipament/${value}`;
    const user = `/user/${value}`;

    return(
        <div>
            <Link onClick={() => closeDrawer()} to={category}>Ano</Link>
            <Link onClick={() => closeDrawer()} to={campus}>Campus</Link>
            <Link onClick={() => closeDrawer()} to={course}>Curso</Link>
            <Link onClick={() => closeDrawer()} to={equipament}>Equipamento</Link>
            <Link onClick={() => closeDrawer()} to={place}>Sala</Link>
            <Link onClick={() => closeDrawer()} to={user}>Usuário</Link>
        </div>
    );
}

export default MenuAdm;