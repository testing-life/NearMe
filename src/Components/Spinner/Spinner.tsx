import React, { FC } from 'react';
import './Spinner.css';

interface Props {
  label?: string;
}

const Spinner: FC<Props> = ({ label }) => {
  return (
    <div className='spinner'>
      <span className='loader'></span>
      {label ? <p className='spinner__label'>{label}</p> : null}
    </div>
  );
};

export default Spinner;
