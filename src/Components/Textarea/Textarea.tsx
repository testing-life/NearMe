import React, { ChangeEvent, FC, useState } from 'react';
import './Textarea.css';

interface Props {
  required?: boolean;
  id: string;
  label: string;
  name?: string;
  value: any;
  onChange: (e: string) => void;
}

const Textarea: FC<Props> = ({
  required = false,
  id,
  label,
  value,
  name,
  onChange
}) => {
  const [error, setError] = useState('');

  const changeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const blurHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
      <textarea
        required={required}
        id={id}
        name={name}
        value={value}
        rows={4}
        onBlur={blurHandler}
        onChange={changeHandler}
      />
      {error ? <p className='input-error'>{error}</p> : null}
    </div>
  );
};

export default Textarea;
