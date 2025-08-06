import { CCard, CCardBody, CSpinner } from '@coreui/react-pro';
import { useCallback, useEffect, useState } from 'react';
import { useEstacionesStore } from '../../../../hook';
import {
  formatCampanias,
  graficaDatos,
  sacarPerfilCTD,
} from '../Utilitis/Helper';
import SelectorCampaniaComponente from './SelectorCampaniaComponente';
import { ProfileChart } from '../../../graficos/profilechar/Profilechar';
import { ProfileNivel } from '../../../graficos/nivelmar/Profilenivel';
import Oleajechar from '../../../graficos/oleaje/Oleajechar';
import Corrientechar from '../../../graficos/corriente/Corrientechar';

export function PopupTabs({ datos }) {

  // console.log('datos', datos);
  const { cargarEstacionId } = useEstacionesStore();

  // Estados
  const [estacionData, setEstacionData] = useState([]);
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [componentselect, setComponentselect] = useState(false);
//////////////////////////////////////////////////////////////////////////
  // ────────────────────────────────────────
  // Cargar datos de la estación al cambiar ID
  // ────────────────────────────────────────
  useEffect(() => {
    // console.log('Datos de la estación:', datos);
    if (datos) fetchEstacion(datos);
  }, [datos]);

  const fetchEstacion = async (id) => {
    setLoading(true);
    try {
      const data = await cargarEstacionId(id);
      // console.log('Datos de la estación:', data);
      setEstacionData(data);
      setCampaignOptions(formatCampanias(data));
    } catch (error) {
      // console.error('Error al cargar los datos de la estación:', error);
    } finally {
      setLoading(false);
    }
  };
//////////////////////////////////////////////////////////////////////////
  // ────────────────────────────────────────
  // Manejar cambio en el selector de campaña/componente
  // ────────────────────────────────────────
  const handleSelectionChange = useCallback(
    
    ({ campaign, component }) => {
      if (!campaign || !component) return setChartData([]);
      setComponentselect(component);
      const datosFiltrados = graficaDatos(campaign, component, estacionData);
      // console.log('Datos filtrados:', datosFiltrados);
      if (!datosFiltrados?.length) return setChartData([]);

      const perfilesPorHora = sacarPerfilCTD({ datos: datosFiltrados, component });
      // console.log('Perfiles por hora:', perfilesPorHora);
      setChartData(perfilesPorHora);
    },
    [estacionData],
  );
//////////////////////////////////////////////////////////////////////////
  // ────────────────────────────────────────
  // Renderizado condicional
  // ────────────────────────────────────────
const grafico = () => {  
  let chartComponent;
  
  switch((componentselect || '').toLowerCase()) {
    case 'perfilctd':
      chartComponent = <ProfileChart data={chartData} />;
      break;

    case 'nivelmar':
      chartComponent = <ProfileNivel data={chartData} />;
      break;

    case 'oleaje':
      chartComponent = <Oleajechar data={chartData} />;
      break;

    case 'corriente':
      chartComponent = <Corrientechar data={chartData} />;
      break;

    default:
      chartComponent = <ProfileChart data={chartData} />;
      break;
  }

  return chartComponent;
};
  //////////////////////////////////////////////////////////////////////////
  return (
    <div>
      {/* Selector de campaña y componente */}
      <CCard className="mb-3">
        <SelectorCampaniaComponente
          campaignOptions={campaignOptions}
          onSelectionChange={handleSelectionChange}
        />
      </CCard>

      {/* Contenedor del gráfico */}
      <CCard>
        <CCardBody style={{ height: 350, minWidth: 450, overflowY: 'auto' }}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <CSpinner color="primary" />
            </div>
          ) : chartData.length ? (
                grafico()
          ) : (
            <div className="text-center text-muted py-5">
              Seleccione una campaña y componente para visualizar los datos.
            </div>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}