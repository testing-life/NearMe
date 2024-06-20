import React, { FC, FormEvent, useState } from 'react';
import Input from '../Input/Input';
import FormLayout from '../FormLayout/FormLayout';
import Button from '../Button/Button';

interface Props {
  submitHandler: (value: string) => void;
  type: 'email' | 'password';
  action?: 'update' | 'reset';
}

const UpdateCredentials: FC<Props> = ({
  submitHandler,
  type,
  action = 'update'
}) => {
  const [credential, setCredential] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitHandler(credential);
  };

  return (
    <FormLayout onSubmit={onSubmit}>
      <Input
        id={type}
        required
        label={`New ${type}`}
        type={type}
        placeholder={type === 'email' ? `New ${type}` : undefined}
        value={''}
        onChange={(value: string) => {
          setCredential(value);
        }}
      />
      <Button>Update {type}</Button>
    </FormLayout>
  );
};

export default UpdateCredentials;
