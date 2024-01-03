import React, { FC, ReactNode } from 'react';
import './Button.css';

interface Props {
  children: ReactNode;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
  variant?: undefined | 'highlight';
}

const Button: FC<Props> = ({
  children,
  fullWidth,
  type = 'button',
  variant
}) => {
  return (
    <button
      type={type}
      className={`btn ${fullWidth ? '--full-width' : null} ${
        variant ? '--is-highlight' : ''
      }`}>
      {children}
    </button>
  );
};

export default Button;
