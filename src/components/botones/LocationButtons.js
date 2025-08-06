import React from "react";
import { CButton, CButtonGroup } from "@coreui/react-pro";
import "./LocationButtons.css"; // Ajusta la ruta según tu estructura de archivos

const LocationButtons = ({ goToLocation }) => {
  return (
    <div className="location-buttons-container">
      {/* 
        Si usas <CButtonGroup vertical>, los botones suelen apilarse
        uno debajo del otro por defecto.
      */}
      <CButtonGroup vertical>
        <CButton color="primary" onClick={() => goToLocation("Tumaco")}>
          Tumaco
        </CButton>
        <CButton color="success" onClick={() => goToLocation("Buenaventura")}>
          Buenaventura
        </CButton>
      </CButtonGroup>
    </div>
  );
};

export default LocationButtons;
