import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import './index.css';
import api from '../../services/api';
import Spinner from 'react-activity/lib/Spinner';
import 'react-activity/lib/Spinner/Spinner.css';
import 'react-widgets/dist/css/react-widgets.css';
import { Combobox } from 'react-widgets'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function FormUser({ onSubmit, user }) {
    const MySwal = withReactContent(Swal);

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [password, setPassword] = useState('');
    const [campus, setCampus] = useState('');
    const [campuses, setCampuses] = useState([]);
    const [func, setFunc] = useState([]);
    const [funcUser, setFuncUser] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        defineCampuses();
        defineFunctions();

        if(user){
            setEmail(user.email);
            setUsername(user.username);
            setFullname(user.fullname);
            setCampus(user.campus);
            setFuncUser(user.function);
        }
    }, [user])

    async function defineCampuses() {
        const response = await api.get("/campuses");
        setCampuses(response.data); 
    }

    function defineFunctions(){
        setFunc([{ func: "adm"}, { func: "user"}]);
    }

    async function save(e) {
        e.preventDefault();
        if(!email) { MySwal.fire('E-mail não preenchido', 'O campo e-mail deve ser preenchido!', 'error'); return }     
        if(!fullname) { MySwal.fire('Nome completo não preenchido', 'O campo nome completo deve ser preenchido!', 'error'); return }     
        if(!username) { MySwal.fire('Nome de usuário não preenchido', 'O campo nome de usuário deve ser preenchido!', 'error'); return }     
        if(!password) { MySwal.fire('Senha não preenchida', 'O campo senha deve ser preenchido!', 'error'); return }     
        if(!funcUser) { MySwal.fire('Função do usuário não preenchida', 'O campo função do usuário deve ser preenchido!', 'error'); return }     
        if(!campus) { MySwal.fire('Campus não preenchido', 'O campo campus deve ser preenchido!', 'error'); return }     

        setIsLoading(true);
        await onSubmit(user.id, {
            username,
            password,
            email,
            fullname,
            function: funcUser.func,
            status: 'Ativo',
            campus_id: campus.id,                
        })
        .then(function (response) {
            clear()
            setIsLoading(false);
            MySwal.fire('Prontinho', 'Usuário cadastrado com sucesso!', 'success');
        })
        .catch(function (error) {
            console.log(error);
            setIsLoading(false);
            if(error?.response?.data?.error) { MySwal.fire('Oops...', error.response.data.error, 'error') }
            else { MySwal.fire('Oops...', 'Houve um erro ao cadastrar, tente novamente!', 'error') }
        });
        
    }

    function clear() {
        setEmail('');
        setFullname('');
        setUsername('');
        setPassword('');
        setCampus('');
        setFuncUser('');
    }
      
    return (
        <div>
            <form onSubmit={save}>
                <div className="d-flex flex-row align-items justify-content-center">
                    <div className="d-flex flex-column pb-2 pt-5 ">
                        <input type="email" 
                                className="tam form-control" 
                                placeholder="E-mail"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                        ></input>
                        <input type="text" 
                                className="tam form-control mt-2" 
                                placeholder="Nome completo"
                                value={fullname}
                                onChange={e => setFullname(e.target.value)}
                        ></input>
                        <input type="text" 
                                className="tam form-control mt-2" 
                                placeholder="Nome de usuário"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                        ></input>
                        <input type="password" 
                                className="tam form-control mt-2" 
                                placeholder="Senha"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                        ></input>
                        <div className="mt-1">
                            <Combobox 
                                textField='func' 
                                data={func} 
                                onChange={setFuncUser}
                                value={funcUser}
                                placeholder="Função do usuário" 
                                className="tam form-control" 
                            />
                        </div>
                        <div className=" mt-2">
                            <Combobox 
                                textField='city' 
                                data={campuses} 
                                onChange={setCampus}
                                value={campus}
                                placeholder="Campus" 
                                className="tam form-control" 
                            />
                        </div>
                        <button 
                            type="submit"
                            className="btn btn-primary btnColor tam mt-3"
                            >
                                Salvar
                                <Spinner className="ml-2" color="#727981" size={16} speed={0.5} animating={isLoading} />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default withRouter(FormUser);