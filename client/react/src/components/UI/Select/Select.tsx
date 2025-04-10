import React from 'react';

import './Select.css';

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
  selected?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  value,
  onChange,
}) => {
  return (
    <div className='select'>
      {label && <label className='label'>{label}</label>}
      <select className='dropdown' value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className='error'>{error}</span>}
    </div>
  );
};
