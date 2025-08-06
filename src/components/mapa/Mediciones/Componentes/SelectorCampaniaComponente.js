import { useEffect, useState, useMemo, useCallback } from 'react';
import { CRow, CCol } from '@coreui/react-pro';
import MultiSelectField from './MultiSelectField';

export default function SelectorCampaniaComponente({
  campaignOptions = [],
  onSelectionChange,
}) {
  const [selectedCampaign, setSelectedCampaign] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState([]);

  // Limpiar selectedComponent cuando cambie la campaña
  useEffect(() => {
    setSelectedComponent([]);
  }, [selectedCampaign]);

  // Obtener componentes según campaña seleccionada
  const selectedComponentOptions = useMemo(() => {
    if (selectedCampaign.length === 0) return [];
    const found = campaignOptions.find(
      (opt) => opt.value === selectedCampaign[0]?.value
    );
    return found?.categorias ?? [];
  }, [selectedCampaign, campaignOptions]);

  // Notificar al padre cuando ambas selecciones están completas
  useEffect(() => {
    if (selectedCampaign.length > 0 && selectedComponent.length > 0) {
      onSelectionChange?.({
        campaign: selectedCampaign[0].value,
        component: selectedComponent[0].value,
      });
    }
  }, [selectedCampaign, selectedComponent, onSelectionChange]);

  // Selecciona automáticamente la primera campaña si no hay nada seleccionado
  useEffect(() => {
    if (campaignOptions.length > 0 && selectedCampaign.length === 0) {
      setSelectedCampaign([campaignOptions[0]]);
    }
  }, [campaignOptions, selectedCampaign.length]);

  const handleCampaignChange = useCallback((selected) => {
    setSelectedCampaign(selected || []);
  }, []);

  const handleComponentChange = useCallback((selected) => {
    setSelectedComponent(selected || []);
  }, []);

  return (
    <CRow className="p-3">
      <CCol md={6}>
        <MultiSelectField
          label="Seleccione la época"
          multiple={false}
          options={campaignOptions}
          value={selectedCampaign}
          onChange={handleCampaignChange}
          optionsTemplate={(option) => (
            <div className="d-flex align-items-center">
              <span className="me-2">📅</span> {option.label}
            </div>
          )}
        />
      </CCol>

      <CCol md={6}>
        <MultiSelectField
          label="Seleccione el componente"
          multiple={false}
          options={selectedComponentOptions}
          value={selectedComponent}
          onChange={handleComponentChange}
          placeholder="Seleccione el componente"
          disabled={selectedComponentOptions.length === 0}
        />
      </CCol>
    </CRow>
  );
}