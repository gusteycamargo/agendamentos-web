import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import Loading from "../components/Loading";
import { isAuthenticated as auth } from "../services/auth";

export default function PrivateRoute(props) {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const { component: Component, ...rest } = props;

    useEffect(() => {
        const fetchData = async () => {
            auth()
            .then(() => {
                setIsAuthenticated(true);
                setLoading(false);
            })
            .catch(() => {
                setIsAuthenticated(false);
                setLoading(false)
            })
        };
        fetchData();
    }, []);

    return (
        <Route
            {...rest}
            render={() =>
                isAuthenticated ? ( <Component {...props} /> ) 
                : loading ? ( <Loading/> ) 
                : ( <Redirect to={{ pathname: "/", state: { from: props.location } }}/> )
            }
        />
    );
};
