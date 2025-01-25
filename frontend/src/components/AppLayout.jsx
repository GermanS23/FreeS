import React, { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
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
      <div className="wrapper d-flex flex-column min-vh-100" style={{ marginLeft: sidebarVisible ? "256px" : "0" }}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="body flex-grow-1 px-3">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AppLayout

