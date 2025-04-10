import React from 'react';

import './Loader.css';

interface LoaderProps {
  text: string;
}

export const Loader: React.FC<LoaderProps> = ({ text }) => {
  return (
    <div className='loader'>
      <div className='loader-spinner'></div>
      <div className='loader-text'>{text}</div>
    </div>
  );
};
