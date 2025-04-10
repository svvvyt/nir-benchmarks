import React from 'react';

import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  value,
  placeholder,
  onChange,
}) => {
  return (
    <div>
      {label && <label className='label'>{label}</label>}
      <input
        className='textbox'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <span className='error'>{error}</span>}
    </div>
  );
};
