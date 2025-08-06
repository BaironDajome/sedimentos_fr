import React, { useState, useEffect, useMemo } from 'react';
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormCheck,
} from '@coreui/react-pro';

const ColumnVisibilityDropdown = ({
  columnsData,
  label = 'Seleccione el puerto',
  onSelectionChange,
  placement = 'bottom-start',
}) => {
  const [columns, setColumns] = useState([]);

  // Inicializar con la opción "Todas las estaciones" activa por defecto
  useEffect(() => {
    if (columnsData && columnsData.length > 0) {
      const inicial = [
        { key: 'all', label: 'Todas las estaciones', visible: true },
        ...columnsData.map((col) => ({
          key: col.id,
          label: col.name,
          visible: false,
        })),
      ];
      setColumns(inicial);
    }
  }, [columnsData]);

  // Notificar cambios al componente padre
  useEffect(() => {
    const visibles = columns.filter((col) => col.visible);
    onSelectionChange?.(visibles);
  }, [columns, onSelectionChange]);

  const handleSelection = (selectedKey) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.key === selectedKey) {
          return { ...col, visible: true };
        }

        // Si se selecciona "Todas", todas deben ser visibles
        if (selectedKey === 'all') {
          return { ...col, visible: col.key === 'all' };
        }

        return { ...col, visible: false };
      })
    );
  };

  // Etiqueta del botón dropdown
  const toggleLabel = useMemo(() => {
    const seleccion = columns.find((col) => col.visible);
    return seleccion ? seleccion.label : label;
  }, [columns, label]);

  return (
    <CDropdown direction="down" placement={placement}>
      <CDropdownToggle color="secondary">{toggleLabel}</CDropdownToggle>
      <CDropdownMenu>
        {columns.map((col) => (
          <CDropdownItem key={col.key}>
            <CFormCheck
              type="radio"
              name="portSelector"
              id={`toggle-${col.key}`}
              label={col.label}
              checked={col.visible}
              onChange={() => handleSelection(col.key)}
            />
          </CDropdownItem>
        ))}
      </CDropdownMenu>
    </CDropdown>
  );
};

export default ColumnVisibilityDropdown;