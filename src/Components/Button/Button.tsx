import React, { FC, ReactNode } from "react";
import "./Button.css";

interface Props {
  children: ReactNode;
  fullWidth?: boolean;
}

const Button: FC<Props> = ({ children, fullWidth }) => {
  return (
    <button className={`btn ${fullWidth ? "--full-width" : null}`}>
      {children}
    </button>
  );
};

export default Button;
