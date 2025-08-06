import { CMultiSelect } from '@coreui/react-pro';

export default function MultiSelectField({
  label,
  multiple = false,
  options = [],
  value = [],
  onChange,
  optionsStyle = 'text',
  optionsTemplate,
  resetSelectionOnOptionsChange = false,
  style = { width: '100%' },
}) {
  return (
    <CMultiSelect
      label={label}
      multiple={multiple}
      options={options}
      value={value}
      onChange={onChange}
      optionsStyle={optionsStyle}
      optionsTemplate={optionsTemplate}
      resetSelectionOnOptionsChange={resetSelectionOnOptionsChange}
      style={style}
    />
  );
}
