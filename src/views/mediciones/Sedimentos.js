import { CCard, CCardBody, CTab, CTabContent, CTabList, CTabPanel, CTabs } from '@coreui/react-pro';
import { useMediaQuery } from 'react-responsive';

const Sedimentos = () => {

  const isMobile = useMediaQuery({ query: '(max-width: 1000px)' });

  return (
    <div>
      <CCard>
        <CCardBody>
          <div style={{ height: '80vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
          <CTabs activeItemKey="Analisis">
            <CTabList variant="tabs">
              <CTab itemKey="Analisis">Analisis General</CTab>
              <CTab itemKey="Estaciones">Estaciones</CTab>
              
              
            </CTabList>

            <CTabContent>
              <CTabPanel className="p-3" itemKey="Analisis">                 
                  <CCardBody>  

                   </CCardBody>                
              </CTabPanel>

              <CTabPanel className="p-3" itemKey="Estaciones">
                <CCard className="mb-4 auto-overflow">
                  <CCardBody>
 
                  </CCardBody>
                </CCard>
              </CTabPanel>

            </CTabContent>,
          </CTabs>
        </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Sedimentos;