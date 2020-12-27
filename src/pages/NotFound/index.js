import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import image from "../../assets/404.jpg"
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

function NotFound({ history }) {
      
    return (
        <div className="background">
            <div style={{ height: '70%' }}>
                <img height="100%" src={image}/>
            </div>
        </div>
    );
}

export default withRouter(NotFound);