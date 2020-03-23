import 'bootstrap/dist/css/bootstrap.css';

import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../../components/Index";
import api from '../../../services/api';
import './index.css';
import Swal from 'sweetalert2';
import dateFnsFormat from 'date-fns/format';
import { parseDate } from '../../../utils/parseDate';
import { formatDate } from '../../../utils/formatDate';
import withReactContent from 'sweetalert2-react-content'
import 'react-activity/lib/Spinner/Spinner.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { Combobox } from 'react-widgets'
import 'react-widgets/dist/css/react-widgets.css';
import Spinner from 'react-activity/lib/Spinner';
import 'react-activity/lib/Spinner/Spinner.css';

function EditSchedule(props) {
    const MySwal = withReactContent(Swal);
    const FORMAT = 'yyyy-MM-dd';
    const FORMATVIEW = 'dd/MM/yyyy';
    
    const [date, setDate] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [period, setPeriod] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [deleted, setDeleted] = useState(false);

    useEffect(() => {
        async function retrieveSchedules() {
            let dateFilter, periodFilter;
            if(date && period) {
                if(period.period === "Manhã") {
                    period.period = "Manha";
                }

                dateFilter = dateFnsFormat(date, FORMAT);
                periodFilter = period.period;
            }
            else {
                dateFilter = dateFnsFormat(new Date(), FORMAT);
                periodFilter = '';
            }

            await api.get("/filter", {
                headers: { 
                    period: periodFilter,
                    date_a: dateFilter, 
                },
            })
            .then(function (response) {
                const schedulesReceived = response.data.filter((elem) => {
                    return elem.status === 'Confirmado';
                });

                setSchedules(schedulesReceived);
            })
            .catch(function (error) {
                console.log(error)
                MySwal.fire('Oops...', 'Houve um tentar visualizar as informações, tente novamente!', 'error');
            });
        }

        retrieveSchedules();
        setPeriods([{ period: "Manhã"}, { period: "Tarde"}, { period: "Noite"}]);
    }, [deleted]);

    async function filter() {
        if(date && period) {
            setIsLoading(true);
            if(period.period === "Manhã") {
                period.period = "Manha";
            }
            await api.get("/filter", {
                headers: { 
                    period: period.period,
                    date_a: dateFnsFormat(date, FORMAT), 
                },
            })
            .then(function (response) {
                const schedulesReceived = response.data.filter((elem) => {
                    return elem.status === 'Confirmado';
                });

                setSchedules(schedulesReceived);
            })
            .catch(function (error) {
                console.log(error)
                MySwal.fire('Oops...', 'Houve um tentar filtrar as informações, tente novamente!', 'error');
            });
            setIsLoading(false);
        }
        else {
            MySwal.fire('Campos não preenchidos...', 'Preencha todos os campos!', 'error')
        }
    }
    
    function returnDateFormatted(date) {
        const string = date.toString();
        const dateString = string.split("T");
        return formatDateString(dateString[0]);
    }

    function formatDateString (string) {
        const input = string.split("-");  // ex input "2010-01-18"
        return input[2]+ "/" +input[1]+ "/" +input[0]; 
    }

    async function deleteSchedules(id) {
        await api.delete(`/schedules/${id}`)
        .then(function (response) {
            MySwal.fire('Prontinho', 'Agendamento deletado com sucesso', 'success');
            setDeleted(true);
        })
        .catch(function (error) {
            console.log(error)
            MySwal.fire('Oops...', 'Houve um tentar visualizar as informações, tente novamente!', 'error');
        });
    }

    function confirmDelete(schedule) {
        MySwal.fire({
            title: 'Tem certeza?',
            text: "Não há como desfazer essa ação!!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sim, exclua!'
          }).then((result) => {
            if (result.value) {
                deleteSchedules(schedule.id);
                setDeleted(false);
            }
        });     
    }
      
    return (
        <div>
            {                 
                <>
                <Index></Index>
                <div className="d-flex align-items-center justify-content-center mt-2">
                    <div className="container-index">
                        {
                            <>
                            <div className="filtrar">
                                <p className="m-0">Filtrar</p>
                                <div className="filtro">
                                    <div className="w-date">
                                        <DayPickerInput
                                            onDayChange={setDate}
                                            className="date-input tam"
                                            formatDate={formatDate}
                                            format={FORMATVIEW}
                                            parseDate={parseDate}
                                            value={date}
                                        />
                                    </div>
                                    
                                    <Combobox 
                                        textField='period' 
                                        data={periods} 
                                        onChange={setPeriod}
                                        value={period}
                                        placeholder="Turno" 
                                        className="tam mr" 
                                    />
                                    
                                    <button onClick={filter} className="btFiltrar">
                                        Filtrar
                                        <Spinner className="ml-2" color="#727981" size={16} speed={0.5} animating={isLoading} />
                                    </button>
                                </div>
                            </div>

                            <table className="table table-bordered table-hover mt-3">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">Data</th>
                                        <th scope="col">Início</th>
                                        <th scope="col">Término</th>
                                        <th scope="col">Solicitante</th>
                                        <th scope="col">Cadastrador</th>
                                        <th scope="col">Sala</th>
                                        <th scope="col">Equipamentos</th>
                                        <th scope="col">Ano</th>
                                        <th scope="col">Curso</th>
                                        <th scope="col">Observações</th>
                                        <th scope="col">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedules.map(schedule => (
                                        <tr key={schedule.id}>
                                            <td>{returnDateFormatted(schedule.date)}</td>
                                            <td>{schedule.initial}</td>
                                            <td>{schedule.final}</td>
                                            <td>{schedule.requesting_user.fullname}</td>
                                            <td>{schedule.registration_user.fullname}</td>
                                            <td>{schedule.place.name}</td>
                                            <td className="d-flex flex-column">
                                                {schedule.equipaments.map(equipament => (
                                                    <p>{equipament.name}</p>
                                                    
                                                ))
                                                }
                                            </td>
                                            <td>{schedule.category.description}</td>
                                            <td>{schedule.course.name}</td>
                                            <td>{schedule.comments}</td>
                                            <td>
                                                <button onClick={() => confirmDelete(schedule)} className="btn btn-danger btnColor">
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))} 
                                    
                                </tbody>
                            </table>
                            </>
                        }
                        
                    </div>
                </div>
                </>
            }
        </div>
    );
}

export default withRouter(EditSchedule);