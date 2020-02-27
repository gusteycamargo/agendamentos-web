import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Index from "../../components/Index";
import api from '../../services/api'
import './index.css';

function NewSchedule(props) {

    

    return (
        <div>
            <Index></Index>
        </div>
    );
}

export default withRouter(NewSchedule);