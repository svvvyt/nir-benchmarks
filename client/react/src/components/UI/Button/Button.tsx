import React from 'react';

import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button className='button' onClick={onClick}>
      {children}
    </button>
  );
};
