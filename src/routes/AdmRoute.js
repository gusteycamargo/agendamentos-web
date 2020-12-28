import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import Loading from "../components/Loading";
import { isAdm, isAuthenticated as auth } from "../services/auth";

export default function AdmRoute(props) {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const { component: Component, ...rest } = props;

    useEffect(() => {
        const fetchData = async () => {
            auth()
            .then(() => {
                isAdm()
                .then(() => {
                    setIsAdmin(true)
                    setIsAuthenticated(true);
                    setLoading(false);
                })
                .catch(() => {
                    setIsAuthenticated(false);
                    setIsAdmin(false)
                    setLoading(false)
                })
            })
            .catch(() => {
                setIsAuthenticated(false);
                setIsAdmin(false)
                setLoading(false)
            })
        };
        fetchData();
    }, []);

    return (
        <Route
            {...rest}
            render={() =>
                isAuthenticated && isAdmin ? ( <Component {...props} /> ) 
                : loading ? ( <Loading/> ) 
                : ( <Redirect to={{ pathname: "/", state: { from: props.location } }}/> )
            }
        />
    );
};
