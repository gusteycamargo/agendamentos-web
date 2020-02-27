import React from 'react';
import { Link } from 'react-router-dom';

function MenuAdm({ value }) {
    const category = `/category/${value}`;
    const campus = `/campus/${value}`;
    const course = `/course/${value}`;
    const place = `/place/${value}`;
    const equipament = `/equipament/${value}`;
    const user = `/user/${value}`;

    return(
        <div>
            <Link to={category}>Ano</Link>
            <Link to={campus}>Campus</Link>
            <Link to={course}>Curso</Link>
            <Link to={equipament}>Equipamento</Link>
            <Link to={place}>Sala</Link>
            <Link to={user}>Usuário</Link>
        </div>
    );
}

export default MenuAdm;