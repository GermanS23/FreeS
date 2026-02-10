import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { CBadge } from "@coreui/react";

export const AppSidebarNav = ({ items }) => {
    const location = useLocation();
    
    // 🔍 DETECCIÓN INTELIGENTE DEL ROL
    const getRoleFromStorage = () => {
        // Intento 1: ¿Está guardado como 'rol' directamente?
        const directRol = localStorage.getItem("rol");
        if (directRol !== null) return Number(directRol);

        // Intento 2: ¿Está dentro de un objeto 'user'? (Común en muchos sistemas)
        const user = localStorage.getItem("user");
        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                return Number(parsedUser.rol);
            } catch (e) { return null; }
        }

        // Intento 3: ¿Está dentro de 'session'?
        const session = localStorage.getItem("session");
        if (session) {
            try {
                const parsedSession = JSON.parse(session);
                return Number(parsedSession.rol);
            } catch (e) { return null; }
        }

        return null;
    };

    const userRole = getRoleFromStorage();

    // 🔴 DEBUG EN CONSOLA: Abre la consola con F12 y mira qué número sale aquí
    console.log("Sistema de Permisos -> Rol Detectado:", userRole);

    const hasPermission = (item) => {
        // Si el ítem NO tiene la propiedad 'roles', lo mostramos siempre
        if (!item.roles) return true;
        
        // Si el ítem tiene roles pero no detectamos ningún rol en el sistema, ocultamos por seguridad
        if (userRole === null) return false;

        // Comparamos
        return item.roles.includes(userRole);
    };

    const navLink = (name, icon, badge) => {
        return (
            <>
                {icon && icon}
                {name && <span className="nav-link-text ms-2">{name}</span>}
                {badge && (
                    <CBadge color={badge.color} className="ms-auto">
                        {badge.text}
                    </CBadge>
                )}
            </>
        );
    };

    const navItem = (item, index) => {
        if (!hasPermission(item)) return null;

        const { component: Component, name, badge, icon, to, ...rest } = item;
        return (
            <NavLink
                key={index}
                to={to}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                {...rest}
            >
                {navLink(name, icon, badge)}
            </NavLink>
        );
    };

    const navGroup = (item, index) => {
        if (!hasPermission(item)) return null;

        const filteredSubItems = item.items?.filter(subItem => hasPermission(subItem));
        if (item.items && (!filteredSubItems || filteredSubItems.length === 0)) return null;

        const { component: Component, name, icon, to, ...rest } = item;

        return (
            <Component
                idx={String(index)}
                key={index}
                toggler={navLink(name, icon)}
                visible={location.pathname.startsWith(to)}
                {...rest}
            >
                {filteredSubItems?.map((sub, idx) =>
                    sub.items ? navGroup(sub, idx) : navItem(sub, idx)
                )}
            </Component>
        );
    };

    return (
        <React.Fragment>
            {items?.map((item, index) =>
                item.items ? navGroup(item, index) : navItem(item, index)
            )}
        </React.Fragment>
    );
};

AppSidebarNav.propTypes = {
    items: PropTypes.arrayOf(PropTypes.any).isRequired,
};