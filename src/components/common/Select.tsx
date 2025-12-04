import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  onChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  onChange,
  defaultValue,
  disabled = false,
}) => {
  return (
    <select
      className='p-2 border rounded-lg bg-transparent disabled:cursor-not-allowed disabled:opacity-50'
      onChange={(e) => onChange?.(e.target.value)}
      defaultValue={defaultValue}
      disabled={disabled}
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