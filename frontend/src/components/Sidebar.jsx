import React from "react";
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarHeader} from "@coreui/react";
import { AppSidebarNav } from "./AppSidebarNav";
import SimpleBar from "simplebar-react";
import Logo from "../assets/Logo.svg";
import navigation from "../nav";
import { LogOut } from "lucide-react";
import { NavLink } from 'react-router-dom'

const Sidebar = ({ visible, unfoldable, onVisibleChange, onLogout }) => {
    return (
        <CSidebar
            position="fixed"
            unfoldable={unfoldable}
            visible={visible}
            onVisibleChange={onVisibleChange}
            className="border-end shadow-sm"
            colorScheme="dark"
            style={{ backgroundColor: "#1a1c23" }}
        >
        <CSidebarHeader className="border-bottom border-secondary p-3 d-flex justify-content-center align-items-center">
            <NavLink 
                to="/dashboard" 
                style={{ 
                    textDecoration: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%' 
                }}
            >
                <img 
                    src={Logo} 
                    alt="FreeShop" 
                    style={{ 
                        height: "50px", 
                        width: "auto",
                        margin: "0 auto", // Fuerza el centrado horizontal
                        display: "block" 
                    }} 
                />
            </NavLink>
        </CSidebarHeader>

            <CSidebarNav>
                <SimpleBar>
                    <AppSidebarNav items={navigation} />
                </SimpleBar>
            </CSidebarNav>

            <CSidebarHeader className="border-top border-secondary p-2">
                <button 
                    onClick={onLogout}
                    className="btn btn-link nav-link text-danger d-flex align-items-center gap-2 w-100 border-0 shadow-none px-3"
                >
                    <LogOut size={18} />
                    <span>Cerrar Sesión</span>
                </button>
            </CSidebarHeader>
        </CSidebar>
    );
};

export default React.memo(Sidebar);