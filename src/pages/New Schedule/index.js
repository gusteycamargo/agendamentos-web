import 'bootstrap/dist/css/bootstrap.css';

import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../components/Index";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import TimePicker from 'react-time-picker';
import 'react-widgets/dist/css/react-widgets.css';
import { Combobox } from 'react-widgets'
import dateFnsFormat from 'date-fns/format';
import api from '../../services/api';
import { parseDate } from '../../utils/parseDate';
import { formatDate } from '../../utils/formatDate';
import 'react-day-picker/lib/style.css';
import './index.css';

function NewSchedule(props) {
    const [date, setDate] = useState(new Date());
    const [initial, setInitial] = useState('');
    const [final, setFinal] = useState('');
    const [places, setPlaces] = useState([]);
    const [disabledFixed, setDisabledFixed] = useState(true);
    const [showAlert, setShowAlert] = useState(true);

    const schedule = {
        date: '',
        initial: '',
        final: '',
        place: ''
    }

    async function disponibilty() {
        const response = await api.get("/availability", {
            headers: { 
                initial,
                final,
                date_a: dateFnsFormat(new Date(), FORMAT), 
            },
        });
        
        setPlaces(response.data.avaibilityPlaces);
        setDisabledFixed(false);
    }

    function controlFields() {
        if(!disabledFixed) {
            setDisabledFixed(!disabledFixed);
        }
    }
    
    const FORMAT = 'yyyy/MM/dd';
    const FORMATVIEW = 'dd/MM/yyyy';
      
    
    
    return (
        <div>
            <Index></Index>
            <div className="container d-flex flex-column align-items-center justify-content-center">
                <div className="d-flex flex-row">
                    <div className="d-flex flex-column pb-2 pt-5 ">
                        <div className="col-sm col-pd pb-2">
                            <DayPickerInput
                                onDayChange={controlFields}
                                className="date-input tam"
                                formatDate={formatDate}
                                format={FORMATVIEW}
                                parseDate={parseDate}
                                placeholder={`${dateFnsFormat(new Date(), FORMATVIEW)}`}
                                value={date}
                                onChange={setDate}
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
                                placeholder="Sala" 
                                className="tam" 
                            />
                        </div>
                        <div className="col-sm col-pd pb-3">
                            <textarea disabled={disabledFixed} className="tam form-control" placeholder="Observações" rows="2"></textarea>
                        </div>
                        <div className="col-sm col-pd pb-2">
                            <button 
                                onClick={disponibilty} 
                                className="btn btn-primary btnColor tam"
                                >Ver. disponibilidade</button>
                        </div>
                    </div>

                    <div className="d-flex flex-column pb-2 pt-5 ">
                        <div className="col-sm col-pd pb-2">
                            <Combobox placeholder="Ano" className="tam" />
                        </div>
                        <div className="col-sm col-pd pb-2">
                            <Combobox placeholder="Solicitante" className="tam" />
                        </div>
                        <div className="col-sm col-pd pb-2">
                            <Combobox placeholder="Curso" className="tam" />
                        </div>
                        <div className="col-sm col-pd pb-2">
                            <Combobox placeholder="Equipamento" className="tam" />
                        </div>
                        <div className="col-sm col-pd pb-3">
                            <textarea className="tam form-control disabled" disabled placeholder="Seus equipamentos selecionados aparecerão aqui" rows="2"></textarea>
                        </div>
                        <div className="col-sm col-pd pb-2">
                            <button className="btn btn-primary btnColor tam">Salvar</button>
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
                            <button className="btn btn-primary btnColor btn-sel">Sel. equi.</button>
                        </div>
                        <div className="col-sm pb-2 col-pd ">
                        </div>
                        <div className="col-sm pb-2 col-pd ">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(NewSchedule);