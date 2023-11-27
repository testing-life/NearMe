import React, { ChangeEvent, FC } from 'react';

interface Props {
  required?: boolean;
  id: string;
  placeholder?: string;
  label: string;
  name?: string;
  value: any;
  type?: 'text' | 'email' | 'password';
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const Input: FC<Props> = ({
  required = false,
  id,
  placeholder = '',
  label,
  value,
  name,
  type = 'text',
  onChange,
  error
}) => {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        required={required}
        id={id}
        name={name}
        type={type}
        className='bg-light text-teal-900'
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      {error ? <p className='text-warning'>{error}</p> : null}
    </>
  );
};

export default Input;
