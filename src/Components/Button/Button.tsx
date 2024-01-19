import React, { FC, ReactNode } from "react";
import "./Button.css";

interface Props {
  children: ReactNode;
  fullWidth?: boolean;
  classes?: string;
  type?: "button" | "submit" | "reset" | undefined;
  variant?: undefined | "highlight";
  clickHandler?: () => void;
}

const Button: FC<Props> = ({
  children,
  fullWidth,
  type = "button",
  variant,
  clickHandler,
  classes,
}) => {
  return (
    <button
      onClick={clickHandler}
      type={type}
      className={`btn ${classes} ${fullWidth ? "-full-width" : ""} ${
        variant ? "-is-highlight" : ""
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
