import React, { useState, useMemo } from 'react';
import { CMultiSelect } from '@coreui/react-pro';

const ALL_OPTION = {
  id: '00000000000000000000',
  name: 'all',
};

const SelecciondePuerto = ({
  columnsData,
  // label = 'Seleccione las estaciones',
  onSelectionChange,
}) => {
  const [selectedKeys, setSelectedKeys] = useState(['all']);

  // Genera opciones compatibles con CMultiSelect
  const options = useMemo(() => {
    if (!columnsData?.length) return [];

    return [
      { value: 'all', label: 'Todas las estaciones' },
      ...columnsData.map((col) => ({
        value: col.id,
        label: col.name,
      })),
    ];
  }, [columnsData]);

  // Encuentra columnas seleccionadas según selectedKeys
  const getSelectedColumns = (keys) => {
    if (keys.includes('all')) return [ALL_OPTION];

    return columnsData.filter((col) => keys.includes(col.id));
  };

  // Maneja cambios en la selección del dropdown
  const handleSelectionChange = (selectedValues) => {
    if (!Array.isArray(selectedValues)) return;

    const selectedValueKeys = selectedValues.map((item) => item.value);

    if (selectedValueKeys.includes('all')) {
      setSelectedKeys(['all']);
      onSelectionChange?.([ALL_OPTION]);
    } else {
      setSelectedKeys(selectedValueKeys);
      const selectedColumns = getSelectedColumns(selectedValueKeys);
      onSelectionChange?.(selectedColumns);
    }
  };

  return (
    <CMultiSelect
      options={options}
      // label={label}
      multiple={false}
      onChange={handleSelectionChange}
      value={options.filter((opt) => selectedKeys.includes(opt.value))}
      selectionLimit={1}
      search
    />
  );
};

export default SelecciondePuerto;