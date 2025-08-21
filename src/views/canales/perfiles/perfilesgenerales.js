import {
  CRow,
  CCol,
  CCard,
  CCardBody,
} from '@coreui/react-pro';
import { useEffect, useState } from 'react';

import MapaBase3D from './componentes/mapabase/MapaBase3D';
import BarraControlesPerfiles from './componentes/seleccion/BarraControlesPanel';

const Perfilesgenerales = () => {

  const [datos, setDatos] = useState([]);


  ////////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      {/* ░░░░░░ Barra de controles arriba ░░░░░░ */}
      <CRow className="g-1 mt-1">
        <CCol xs={12}>
          <CCard>
            <CCardBody>
              <BarraControlesPerfiles />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* ░░░░░░ Dos mapas lado a lado ░░░░░░ */}
      <CRow className="g-1 mt-1">
        {/* Primer Mapa */}
        <CCol xs={12}>
          <CCard>
            <CCardBody style={{ height: '510px' }}>
              <MapaBase3D/>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Segundo Mapa */}
        {/* <CCol xs={6}>
          <CCard>
            <CCardBody style={{ height: '510px' }}>
            </CCardBody>
          </CCard>
        </CCol> */}
      </CRow>
    </>
  );
};

export default Perfilesgenerales;