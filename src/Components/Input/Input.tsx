import React, { ChangeEvent, FC } from "react";

interface Props {
  required?: boolean;
  id: string;
  placeholder?: string;
  label: string;
  value: any;
  type: "text" | "email" | "password";
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<Props> = ({
  required = false,
  id,
  placeholder = "",
  label,
  value,
  type,
  onChange,
}) => {
  return (
    <div className="mb-2">
      <label htmlFor={id}>{label}</label>
      <input
        required={required}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
