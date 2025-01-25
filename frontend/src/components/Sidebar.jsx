import React from "react"
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler, CSidebarHeader } from "@coreui/react"
import { AppSidebarNav } from "./AppSidebarNav"
import SimpleBar from "simplebar-react"
import "simplebar-react/dist/simplebar.min.css"
import Logo from "../assets/Logo.svg"
import navigation from "../nav"
import { Link } from "react-router-dom"

const Sidebar = ({ visible, unfoldable, onVisibleChange, onUnfoldableChange, onLogout }) => {
  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={visible}
      onVisibleChange={onVisibleChange}
      className="border-end"
      colorScheme="dark"
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand className="d-none d-md-flex">
          <Link to="/">
            <img
              src={Logo || "/placeholder.svg"}
              alt="Logo FreeShop"
              style={{ height: "65px", paddingLeft: "40px", margin: "10px" }}
            />
          </Link>
        </CSidebarBrand>
      </CSidebarHeader>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarHeader className="border-top">
        <CSidebarToggler className="d-none d-lg-flex" onClick={onLogout} />
      </CSidebarHeader>
    </CSidebar>
  )
}

export default React.memo(Sidebar)

