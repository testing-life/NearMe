import React, { Children, FC, FormEvent, ReactNode } from 'react';
import './FormLayout.css';

interface Props {
  children?: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const FormLayout: FC<Props> = ({ children, onSubmit }) => {
  return (
    <form className='form-layout' onSubmit={onSubmit}>
      {Children.map(children, (child) => (
        <div className='form-layout__child'>{child}</div>
      ))}
    </form>
  );
};

export default FormLayout;
