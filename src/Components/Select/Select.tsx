import React, { ChangeEvent, FC } from "react";
import "./Select.css";

interface Option {
  label: string;
  value: string;
}

interface Props {
  options: Option[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  id: string;
  name?: string;
  inverted?: boolean;
}

const Select: FC<Props> = ({ options, onChange, id, name, inverted }) => {
  return (
    <div className={`select ${inverted ? "-is-inverted" : ""}`}>
      <label className="invisible" htmlFor={id}>
        Choose a view mode:
      </label>

      <select
        name={name}
        id={id}
        defaultValue={options[0].value}
        onChange={onChange}
      >
        {options?.map((option: Option, index: number) => (
          <option key={`${option}${index}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
