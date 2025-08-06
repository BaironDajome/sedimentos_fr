import React from 'react'
import { CFooter } from '@coreui/react-pro'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://www.dimar.mil.co/" target="_blank" rel="noopener noreferrer">
          Dimar
        </a>
        <span className="ms-1">&copy; 2025</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Dimar</span>
        <a
          href="https://cccp.dimar.mil.co/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Centro de Investigaciones Oceanográficas e Hidrográficas del Pacífico
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
