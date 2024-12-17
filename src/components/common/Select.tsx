import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  onChange?: (value: string) => void;
  defaultValue?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  onChange,
  defaultValue,
}) => {
  return (
    <select
      className='p-2 border rounded-lg bg-transparent'
      onChange={(e) => onChange?.(e.target.value)}
      defaultValue={defaultValue}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;