import React, { ChangeEvent, FC } from "react";

interface Props {
  required?: boolean;
  id: string;
  placeholder?: string;
  label: string;
  value: any;
  type: "text" | "email" | "password";
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const Input: FC<Props> = ({
  required = false,
  id,
  placeholder = "",
  label,
  value,
  type,
  onChange,
  error,
}) => {
  return (
    <div className="mb-2">
      <label htmlFor={id}>{label}</label>
      <input
        required={required}
        id={id}
        type={type}
        className="bg-light"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      {error ? <p className="text-warning">{error}</p> : null}
    </div>
  );
};

export default Input;
