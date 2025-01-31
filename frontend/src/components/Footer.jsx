import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  const date = new Date().getFullYear()

  return (
    <CFooter>
      <div>
        <a href="https://www.linkedin.com/in/germ%C3%A1n-s%C3%A1nchez-a2651326b/" target="_blank" rel="noopener noreferrer">
          Germán Sánchez
        </a>
        <span className="ms-1">&copy; {date} - Sistema FreeShop</span>
      </div>
      {/* <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
          CoreUI React Admin &amp; cirugias Template
        </a>
      </div> */}
    </CFooter>
  )
}

export default React.memo(AppFooter)
