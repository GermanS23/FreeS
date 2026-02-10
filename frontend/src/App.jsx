import React, { useState, useEffect } from "react";
import { BrowserRouter, useRoutes, useLocation } from "react-router-dom";
import routes from "./routes";
import authService from "./services/auth.service";

const AppWrapper = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true); 
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("token");
                
                if (token) {
                    // Intentamos validar el token con el servidor
                    const user = await authService.getCurrentUser();
                    // Si el servidor responde OK, estamos logueados
                    setIsLoggedIn(!!user);
                } else {
                    // No hay token, es un invitado
                    setIsLoggedIn(false);
                }
            } catch (error) {
                // Si el token expiró o el servidor dio 403/500
                console.error("Error de autenticación, procediendo como invitado:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setIsLoggedIn(false);
            } finally {
                // IMPORTANTÍSIMO: Finalizar la carga pase lo que pase
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Efecto para rastrear cambios en la ubicación (útil para debug)
    useEffect(() => {
        console.log("📍 Ruta actual:", location.pathname);
    }, [location]);

    // Generamos las rutas pasando los estados actuales
    const element = useRoutes(routes(isLoggedIn, setIsLoggedIn, isLoading));

    if (isLoading) {
        return (
            <div style={{ 
                height: '100vh', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                flexDirection: 'column',
                fontFamily: 'sans-serif'
            }}>
                <div className="spinner"></div> {/* Podés usar el CSS que ya tenés */}
                <p>Verificando credenciales...</p>
            </div>
        );
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