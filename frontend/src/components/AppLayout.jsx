import React, { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
import Footer from "./Footer"
import "@coreui/coreui/dist/css/coreui.min.css"
import "simplebar-react/dist/simplebar.min.css"

const AppLayout = ({ setIsLoggedIn }) => {
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [sidebarUnfoldable, setSidebarUnfoldable] = useState(false)
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userRole") // Importante limpiar el rol
    setIsLoggedIn(false)
    navigate("/login")
  }

  return (
    <div className="wrapper d-flex flex-column min-vh-100 bg-light">
      <Sidebar
        visible={sidebarVisible}
        unfoldable={sidebarUnfoldable}
        onVisibleChange={setSidebarVisible}
        onUnfoldableChange={setSidebarUnfoldable}
        onLogout={handleLogout}
      />
      <div 
        className="wrapper d-flex flex-column min-vh-100" 
        style={{ 
          marginLeft: sidebarVisible ? (sidebarUnfoldable ? "64px" : "256px") : "0",
          transition: "margin-left 0.15s ease-in-out" 
        }}
      >
        <Header toggleSidebar={toggleSidebar} />
        <div className="body flex-grow-1 px-3 py-3">
          <Outlet />
        </div>
        <Footer/>
      </div>
    </div>
  )
}

export default AppLayout