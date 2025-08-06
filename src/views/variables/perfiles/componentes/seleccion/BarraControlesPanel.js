import React, { useEffect, useState } from 'react';
import {
  CRow,
  CCol,
  CFormSelect,
  CDateRangePicker,
  CLoadingButton,
} from '@coreui/react-pro';
import SelecciondePuerto from '../../../../../components/menulist/SelecciondePuerto';

const BarraControlesPerfiles = () => {
    const [nombre, setNombre] = useState(() => {
      return localStorage.getItem("puertos") || "";
    });
  ///////////////////////////////////////////////////////////////////////
      const cargarDatos = async () => {  
      console.log(nombre);
    };
  ///////////////////////////////////////////////////////////////////////
    useEffect(() => {
      cargarDatos();
    }, []);
    ///////////////////////////////////////////////////////////////////////
  /* ─────────────── estados ─────────────── */
  const [puertosSeleccionados, setPuertosSeleccionados] = useState([]);
  const isButtonEnabled = puertosSeleccionados && puertosSeleccionados.length > 0;

  /* ─────────────── handlers (vacíos de momento) ─────────────── */
  const handleStartDateChange = () => {};
  const handleEndDateChange = () => {};
  const handleDeviceChange = () => {};
  const handleButtonClick = () => {};
  /* ─────────────── data (cargar datos de componentes) ─────────────── */



  return (
    <CRow className="g-3 mb-3 align-items-end">
      {/* Selector de Puerto */}
      <CCol xs={12} sm={6} lg={4} xl={3}>
        <div className="w-250">
          <SelecciondePuerto
            columnsData={[]}
            onSelectionChange={setPuertosSeleccionados}
          />
        </div>
      </CCol>

      {/* Rango de Fechas */}
      <CCol xs={12} sm={6} lg={4} xl={3}>
        <CDateRangePicker
          size="sm"
          locale="es-CO"
          placeholder={['Fecha inicial', 'Fecha final']}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          className="w-100"
        />
      </CCol>

      {/* Botón de Cargar */}
      <CCol xs={12} sm={6} lg={3} xl={3}>
        <CLoadingButton
          color="primary"
          variant="outline"
          timeout={1000}
          className="w-100"
          disabled={!isButtonEnabled}
          onClick={handleButtonClick}
        >
          Cargar
        </CLoadingButton>
      </CCol>
    </CRow>
  );
};

export default BarraControlesPerfiles;