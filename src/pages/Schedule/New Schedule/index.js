import 'bootstrap/dist/css/bootstrap.css';

import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import TimePicker from 'react-time-picker';
import 'react-widgets/dist/css/react-widgets.css';
import { Combobox } from 'react-widgets'
import dateFnsFormat from 'date-fns/format';
import api from '../../../services/api';
import { parseDate } from '../../../utils/parseDate';
import { formatDate } from '../../../utils/formatDate';
import 'react-day-picker/lib/style.css';
import './index.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Spinner from 'react-activity/lib/Spinner';
import 'react-activity/lib/Spinner/Spinner.css';

function NewSchedule(props) {
    const FORMAT = 'yyyy-MM-dd';
    const FORMATVIEW = 'dd/MM/yyyy';
    const MySwal = withReactContent(Swal);

    const [date, setDate] = useState(new Date());
    const [initial, setInitial] = useState('');
    const [final, setFinal] = useState('');
    const [equipament, setEquipament] = useState([]);
    const [course, setCourse] = useState('');
    const [category, setCategory] = useState('');
    const [place, setPlace] = useState('');
    const [requestingUser, setRequestingUser] = useState('');

    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [places, setPlaces] = useState([]);
    const [equipaments, setEquipaments] = useState([]);
    const [equipamentsView, setEquipamentsView] = useState([]);
    const [equipamentsSelected, setEquipamentsSelected] = useState([]);
    const [comments, setComments] = useState('');
    const [users, setUsers] = useState([]);
    const [disabledFixed, setDisabledFixed] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    async function disponibilty() {
        if(date && initial && final) {
            setIsLoading(true);
            await api.get("/availability", {
                headers: { 
                    initial,
                    final,
                    date_a: dateFnsFormat(date, FORMAT), 
                },
            })
            .then(function (response) {
                setEquipaments(response.data.avaibilityEquipaments);
                setPlaces(response.data.avaibilityPlaces);
                setDisabledFixed(false);
            })
            .catch(function (error) {
                MySwal.fire('Oops...', 'Houve um erro ao verificar a disponibilidade, tente novamente!', 'error')
            });
            setIsLoading(false);

            let response = await api.get("/users");
            setUsers(response.data); 
            response = await api.get("/categories");
            setCategories(response.data); 
            response = await api.get("/courses");
            setCourses(response.data); 
        }
        else {
            MySwal.fire('Campos não preenchidos...', 'Preencha todos os campos!', 'error')
        }
    }

    function selectEquipament() {
        if(equipamentsSelected.includes(equipament.id)) {
            MySwal.fire('Oops...', 'Este equipamento já foi selecionado!', 'error')
        }
        else {
            equipamentsSelected.push(equipament.id);
            setEquipamentsView([...equipamentsView, equipament.name]);
            //equipamentsView.push(equipament.name);
        }
    }

    function controlFields() {
        if(!disabledFixed) {
            setDisabledFixed(!disabledFixed);
        }
    }

    async function save() {
        if(typeof course === 'object' && typeof category === 'object' && typeof place === 'object' && typeof requestingUser === 'object' ) {
            const userLogged = await api.get('/userLogged');
            setIsLoading(true);
            await api.post("/schedules", {
                    place_id: place.id,
                    category_id: category.id,
                    course_id: course.id,
                    registration_user_id: userLogged.data.user.id,
                    requesting_user_id: requestingUser.id,
                    campus_id: userLogged.data.campus.id,
                    comments,
                    date: dateFnsFormat(date, FORMAT),
                    initial,
                    final,
                    equipaments: equipamentsSelected    
            })
            .then(function (response) {
                console.log(response.data);
                MySwal.fire('Prontinho', 'Agendamento realizado com sucesso!', 'success');
                controlFields();
                setEquipamentsView('');
                setComments('');
                setEquipament([]);
                setPlace('');
                setCourse('');
                setRequestingUser('');
                setCategory('');
            })
            .catch(function (error) {
                console.log(error)
                MySwal.fire('Oops...', 'Houve um erro ao realizar seu agendamento, tente novamente!', 'error');
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
                            <div className="col-sm col-pd pb-2">
                                <DayPickerInput
                                    onDayChange={setDate}
                                    className="date-input tam"
                                    formatDate={formatDate}
                                    format={FORMATVIEW}
                                    parseDate={parseDate}
                                    value={date}
                                    onDayTouchStart={controlFields}
                                />
                            </div>
                            <div className="col-sm col-pd pb-2">
                                <TimePicker        
                                    onClick={controlFields}
                                    className="time tam" 
                                    disableClock={true} 
                                    value={initial} 
                                    onChange={setInitial}
                                />
                            </div>
                            <div className="col-sm col-pd pb-2">
                                <TimePicker 
                                    onClick={controlFields}
                                    className="time tam" 
                                    disableClock={true} 
                                    value={final} 
                                    onChange={setFinal}
                                />
                            </div>
                            <div className="col-sm col-pd pb-2">
                                <Combobox 
                                    disabled={disabledFixed} 
                                    textField='name' 
                                    data={places} 
                                    onChange={setPlace}
                                    value={place}
                                    placeholder="Sala" 
                                    className="tam" 
                                />
                            </div>
                            <div className="col-sm col-pd pb-3">
                                <textarea 
                                    disabled={disabledFixed} 
                                    className="tam form-control" 
                                    placeholder="Observações" 
                                    rows="2"
                                    value={comments}
                                    onChange={e => setComments(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="col-sm col-pd pb-2">
                                <button 
                                    onClick={disponibilty} 
                                    className="btn btn-primary btnColor tam"
                                    >
                                        Ver. disponibilidade
                                        <Spinner className="ml-2" color="#727981" size={16} speed={0.5} animating={isLoading} />
                                    </button>
                            </div>
                        </div>

                        <div className="d-flex flex-column pb-2 pt-5 ">
                            <div className="col-sm col-pd pb-2">
                                <Combobox 
                                    disabled={disabledFixed} 
                                    textField='description' 
                                    data={categories} 
                                    onChange={setCategory}
                                    value={category}
                                    placeholder="Ano" 
                                    className="tam" 
                                />
                            </div>
                            <div className="col-sm col-pd pb-2">
                                <Combobox 
                                    disabled={disabledFixed} 
                                    onChange={setRequestingUser}
                                    value={requestingUser}
                                    placeholder="Solicitante" 
                                    className="tam" 
                                    textField='fullname' 
                                    data={users}     
                                />
                            </div>
                            <div className="col-sm col-pd pb-2">
                                <Combobox 
                                    disabled={disabledFixed} 
                                    onChange={setCourse}
                                    value={course}
                                    textField='name' 
                                    data={courses} 
                                    placeholder="Curso" 
                                    className="tam" 
                                />
                            </div>
                            <div className="col-sm col-pd pb-2">
                                <Combobox 
                                    textField='name' 
                                    data={equipaments} 
                                    disabled={disabledFixed} 
                                    onChange={setEquipament}
                                    value={equipament}
                                    placeholder="Equipamento" 
                                    className="tam" 
                                />
                            </div>
                            <div className="col-sm col-pd pb-3">
                                <textarea 
                                    disabled={disabledFixed} 
                                    className="tam form-control disabled"  
                                    placeholder="Seus equipamentos selecionados aparecerão aqui" 
                                    rows="2"
                                    value={equipamentsView.toString()}></textarea>
                            </div>
                            <div className="col-sm col-pd pb-2">
                                <button 
                                    disabled={disabledFixed} 
                                    onClick={save} 
                                    className="btn btn-primary btnColor tam"
                                    >
                                        Salvar
                                        <Spinner className="ml-2" color="#727981" size={16} speed={0.5} animating={isLoading} />
                                </button>
                            </div>
                        </div>

                        <div className="d-flex flex-column pb-2 pt-5 ">
                            <div className="col-right pb-1">
                            </div>
                            <div className="col-right pb-1">
                            </div>
                            <div className="col-right pb-1">
                            </div>
                            <div className="col-right pb-1">
                                <button disabled={disabledFixed}  onClick={selectEquipament} className="btn btn-primary btnColor btn-sel">Sel. equi.</button>
                            </div>
                            <div className="col-sm pb-2 col-pd ">
                            </div>
                            <div className="col-sm pb-2 col-pd ">
                            </div>
                        </div>
                    </div>
                </div>
                </>
            }
        </div>
    );
}

export default withRouter(NewSchedule);