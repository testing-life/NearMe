import React, { ChangeEvent, FC } from "react";
import "./Input.css";
interface Props {
  required?: boolean;
  id: string;
  placeholder?: string;
  label: string;
  name?: string;
  value: any;
  type?: "text" | "email" | "password";
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const Input: FC<Props> = ({
  required = false,
  id,
  label,
  value,
  name,
  type = "text",
  onChange,
  error,
}) => {
  return (
    <div className={`input-wrapper ${true ? "--is-invalid" : null}`}>
      <label className="invisible" htmlFor={id}>
        {label}
      </label>
      <input
        required={required}
        id={id}
        name={name}
        type={type}
        className="input"
        placeholder={label}
        value={value}
        onChange={onChange}
      />
      {error ? <p className="text-warning">{error}</p> : null}
    </div>
  );
};

export default Input;
