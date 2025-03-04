import React, { useState, useEffect } from "react";
import { BrowserRouter, useRoutes, useLocation } from "react-router-dom";
import routes from "./routes";

const AppWrapper = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Estado de carga
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // Actualiza el estado de autenticación
        setIsLoading(false); // Finaliza la carga
        console.log("Login status:", !!token);
    }, []);

    useEffect(() => {
        console.log("Current location:", location.pathname);
    }, [location]);

    if (isLoading) {
        return <div>Cargando...</div>; // Muestra un spinner o mensaje de carga
    }

    const element = useRoutes(routes(isLoggedIn, setIsLoggedIn));
    return element;
};

const App = () => {
    return (
        <BrowserRouter basename="/">
            <AppWrapper />
        </BrowserRouter>
    );
};

export default App;