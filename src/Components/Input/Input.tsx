import React, { ChangeEvent, FC, useState } from 'react';
import './Input.css';
interface Props {
  required?: boolean;
  id: string;
  placeholder?: string;
  label: string;
  name?: string;
  value: any;
  type?: 'text' | 'email' | 'password';
  onChange: (e: string) => void;
}

const Input: FC<Props> = ({
  required = false,
  id,
  label,
  value,
  name,
  type = 'text',
  onChange
}) => {
  const [error, setError] = useState('');

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const blurHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (required && e.target.validationMessage) {
      setError(e.target.validationMessage);
    } else {
      setError('');
    }
  };

  return (
    <div className='input-wrapper'>
      <label className='invisible' htmlFor={id}>
        {label}
      </label>
      <input
        required={required}
        id={id}
        name={name}
        type={type}
        placeholder={label}
        value={value}
        onBlur={blurHandler}
        onChange={changeHandler}
      />
      {error ? <p className='input-error'>{error}</p> : null}
    </div>
  );
};

export default Input;
