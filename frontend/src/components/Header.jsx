import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  CNavLink,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CCollapse,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilMenu,
  cilUser,
  cilSettings,
  cilPowerStandby,
} from '@coreui/icons'

const Header = ({ toggleSidebar }) => {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <CHeader position="sticky" className="mb-4 border-bottom" >
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={toggleSidebar}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none">
          Mi App
        </CHeaderBrand>
        <CHeaderToggler
          className="d-md-none"
          onClick={() => setVisible(!visible)}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
       
      </CContainer>
    </CHeader>
  )
}

export default Header

