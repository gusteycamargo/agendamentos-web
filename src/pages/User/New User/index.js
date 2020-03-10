import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import './index.css';
import 'react-widgets/dist/css/react-widgets.css';
import { Combobox } from 'react-widgets'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Spinner from 'react-activity/lib/Spinner';
import 'react-activity/lib/Spinner/Spinner.css';

function NewCategory(props) {
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

    function defineFunctions(){
        setFunc([{ func: "adm"}, { func: "user"}]);
    }

    useEffect(() => {
        async function defineCampuses() {
            const response = await api.get("/campuses");
            setCampuses(response.data); 
        }

        defineCampuses();
        defineFunctions();
    }, []);

    async function save() {
        if(email && fullname && username && password && typeof funcUser === 'object' && typeof campus === 'object') {
            setIsLoading(true);
            await api.post("/users", {
                username,
                password,
                email,
                fullname,
                function: funcUser.func,
                status: 'Ativo',
                campus_id: campus.id,                
            })
            .then(function (response) {
                console.log(response.data);
                MySwal.fire('Prontinho', 'Ano cadastrado com sucesso!', 'success');
                setEmail('');
                setFullname('');
                setUsername('');
                setPassword('');
                setCampus('');
                setFuncUser([]);
            })
            .catch(function (error) {
                console.log(error)
                MySwal.fire('Oops...', 'Houve um erro ao cadastrar, tente novamente!', 'error');
            });
            setIsLoading(false);
        }
        else {
            MySwal.fire('Campos não preenchidos...', 'Preencha todos os campos!', 'error')
        }
    }
      
    return (
        <div>
            {      
                <>
                <Index></Index>
                <div className="container d-flex flex-column align-items-center justify-content-center">
                    <div className="d-flex flex-row">
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
                                onClick={save} 
                                className="btn btn-primary btnColor tam mt-3"
                                >
                                    Salvar
                                    <Spinner className="ml-2" color="#727981" size={16} speed={0.5} animating={isLoading} />
                            </button>
                        </div>
                    </div>
                </div>
                </>
            }
        </div>
    );
}

export default withRouter(NewCategory);