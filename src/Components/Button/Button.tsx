import React, { FC, ReactNode } from "react";
import "./Button.css";

interface Props {
  children: ReactNode;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
}

const Button: FC<Props> = ({ children, fullWidth, type = "button" }) => {
  return (
    <button type={type} className={`btn ${fullWidth ? "--full-width" : null}`}>
      {children}
    </button>
  );
};

export default Button;
