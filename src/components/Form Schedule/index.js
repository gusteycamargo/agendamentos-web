import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import TimePicker from 'react-time-picker';
import dateFnsFormat from 'date-fns/format';
import { parseDate } from '../../utils/parseDate';
import { formatDate } from '../../utils/formatDate';
import api from '../../services/api';
import Spinner from 'react-activity/lib/Spinner';
import { Combobox } from 'react-widgets'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'react-day-picker/lib/style.css';
import 'react-activity/lib/Spinner/Spinner.css';
import 'react-widgets/dist/css/react-widgets.css';
import './index.css';
import { useSelector, useDispatch } from 'react-redux';

function FormSchedule({ onSubmit, schedule }) {
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
    const [isUser, setIsUser] = useState(true);
    const [isLoadingVerification, setIsLoadingVerification] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const userLogged = useSelector(state => state.userLogged.userLogged);

    useEffect(() => {
        async function getUser() {
            //console.log(userLogged);
        }

        getUser();

        if(schedule !== ''){   
            const dateSplit = schedule.date.split('T');
            const parse = dateSplit[0].split('-');
            
            setDate(new Date(parse[0], parse[1]-1, parse[2]));            
            setEquipaments(schedule.equipaments);
            setInitial(schedule.initial);
            setFinal(schedule.final);
            setCourse(schedule.course);
            setCategory(schedule.category);
            setPlace(schedule.place);
            setRequestingUser(schedule.requesting_user);
            setComments(schedule.comments);
        }
    }, [schedule]);

    async function disponibilty() {        
        if(date && initial && final) {
            setIsLoadingVerification(true);
            await api.get("/availability", {
                headers: { 
                    initial,
                    final,
                    date_a: dateFnsFormat(date, FORMAT), 
                    status: 'Confirmado'
                },
            })
            .then(function (response) {
                if(schedule !== ''){                    
                    setEquipaments([...equipaments, ...response.data.avaibilityEquipaments]);
                    setPlaces([schedule.place, ...response.data.avaibilityPlaces]);
                }
                else {
                    setEquipaments(response.data.avaibilityEquipaments);
                    setPlaces(response.data.avaibilityPlaces);
                }
                setDisabledFixed(false);

                retrieveData();
            })
            .catch(function (error) {
                console.log(error);
                
                MySwal.fire('Oops...', error.response.data.error, 'error')
            });
            setIsLoadingVerification(false);           
        }
        else {
            MySwal.fire('Campos não preenchidos...', 'Preencha todos os campos!', 'error')
        }
    }

    async function retrieveData() {
        let response;
        if(userLogged.function === 'adm') {                
            response = await api.get("/users");

            const usersReceived = response.data.filter((elem) => {
                return elem.status === 'Ativo';
            });
            setUsers(usersReceived); 
        }
        else {
            setUsers([userLogged]);
        }

        response = await api.get("/categories");
        const categoriesReceived = response.data.filter((elem) => {
            return elem.status === 'Ativo';
        });
        setCategories(categoriesReceived); 
        
        response = await api.get("/courses");
        const coursesReceived = response.data.filter((elem) => {
            return elem.status === 'Ativo';
        });
        setCourses(coursesReceived); 
    }

    function selectEquipament() {
        if(equipamentsSelected.includes(equipament.id)) {
            MySwal.fire('Oops...', 'Este equipamento já foi selecionado!', 'error')
        }
        else {
            equipamentsSelected.push(equipament.id);
            setEquipamentsView([...equipamentsView, equipament.name]);
        }
    }

    function controlFields() {
        if(!disabledFixed) {
            setDisabledFixed(!disabledFixed);
        }
    }

    async function save(e) {
        e.preventDefault();
        
        if(typeof course === 'object' && typeof category === 'object' && typeof place === 'object' && typeof requestingUser === 'object' ) {
            setIsLoading(true);

            const response = await api.get('/userLogged');
            if(isUser){
                requestingUser.id = userLogged.id;
            }

            await onSubmit(schedule.id, {
                place_id: place.id,
                category_id: category.id,
                course_id: course.id,
                registration_user_id: userLogged.id,
                requesting_user_id: requestingUser.id,
                campus_id: response.data.campus.id,
                comments,
                date: dateFnsFormat(date, FORMAT),
                initial,
                final,
                equipaments: equipamentsSelected,
                status: "Confirmado"
            })
            controlFields();
            setEquipamentsView('');
            setComments('');
            setEquipament([]);
            setPlace('');
            setCourse('');
            setRequestingUser('');
            setCategory('');
            setEquipamentsSelected([]);
            setIsLoading(false);
        }
        else {
            MySwal.fire('Campos não preenchidos...', 'Preencha todos os campos!', 'error')
        }
    }
      
    return (
        <div>
            {      
                <form onSubmit={save}>
                    <div className="d-flex flex-row align-items justify-content-center">
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
                                        type="button"
                                        onClick={disponibilty} 
                                        className="btn btn-primary btnColor tam"
                                        >
                                            Ver. disponibilidade
                                            <Spinner className="ml-2" color="#727981" size={16} speed={0.5} animating={isLoadingVerification} />
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
                                        disabled={true} 
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
                                    <button disabled={disabledFixed} type="button" onClick={selectEquipament} className="btn btn-primary btnColor btn-sel">Sel. equi.</button>
                                </div>
                                <div className="col-sm pb-2 col-pd ">
                                </div>
                                <div className="col-sm pb-2 col-pd ">
                                </div>
                            </div>
                    </div>
                </form>
            }
        </div>
    );
}

export default withRouter(FormSchedule);