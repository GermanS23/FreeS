import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { CBadge } from "@coreui/react";

export const AppSidebarNav = ({ items }) => {
    const location = useLocation();

    const navLink = (name, icon, badge) => {
        return (
            <>
                {icon && icon}
                {name && <span className="nav-link-text">{name}</span>}
                {badge && (
                    <CBadge color={badge.color} className="ms-auto">
                        {badge.text}
                    </CBadge>
                )}
            </>
        );
    };

    const navItem = (item, index) => {
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
        const { component: Component, name, icon, to, items: subItems, ...rest } = item;

        return (
            <Component
                idx={String(index)}
                key={index}
                toggler={navLink(name, icon)}
                visible={location.pathname.startsWith(to)}
                {...rest}
            >
                {subItems?.map((item, index) =>
                    item.items ? navGroup(item, index) : navItem(item, index)
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