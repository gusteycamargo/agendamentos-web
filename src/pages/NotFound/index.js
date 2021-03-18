import image from "../../assets/404.jpg"
import React from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from '@material-ui/core';
import NavBar from "../../components/NavBar";

function NotFound() {
    const classes = useStyles();

    return (<>
        <NavBar/>
        <div className={classes.background}>
            <div style={{ height: '70%' }}>
                <img alt="404 error" height="100%" src={image}/>
            </div>
        </div>
    </>);
}

const useStyles = makeStyles((theme) => ({
    background: {
        backgroundColor: '#000',
        display: 'flex',
        justifyContent: 'center',
        height: '90vh',
    },
}));

export default withRouter(NotFound);