import React, { useState, useEffect } from "react";
import { BrowserRouter, useRoutes, useLocation } from "react-router-dom";
import routes from "./routes";

const AppWrapper = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        // Inicializa isLoggedIn directamente desde localStorage
        const token = localStorage.getItem("token");
        return !!token;
    });
    const [isLoading, setIsLoading] = useState(true); // Estado de carga
    const location = useLocation();

    // Efecto para sincronizar el estado de autenticación
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // Actualiza el estado de autenticación
        setIsLoading(false); // Finaliza la carga
        console.log("Login status:", !!token);
    }, []);

    // Efecto para rastrear cambios en la ubicación
    useEffect(() => {
        console.log("Current location:", location.pathname);
    }, [location]);

    // Obtiene el elemento de ruta (siempre se llama, sin importar isLoading)
    const element = useRoutes(routes(isLoggedIn, setIsLoggedIn, isLoading));

    // Si está cargando, muestra un mensaje de carga
    if (isLoading) {
        return <div>Cargando...</div>;
    }

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