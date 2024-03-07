import React, { FC, FormEvent, useState } from 'react';
import Input from '../Input/Input';
import FormLayout from '../FormLayout/FormLayout';
import Button from '../Button/Button';

interface Props {
  submitHandler: (email: string, password: string) => void;
}

const Login: FC<Props> = ({ submitHandler }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email && password) {
      submitHandler(email, password);
    }
  };

  return (
    <FormLayout onSubmit={onSubmit}>
      <Input
        id='email'
        required
        label='Email'
        type='email'
        placeholder='email'
        value={email}
        onChange={(value: string) => setEmail(value)}
      />
      <Input
        id='password'
        required
        label='Password'
        type='password'
        placeholder='password'
        value={password}
        onChange={(value: string) => setPassword(value)}
      />
      <Button fullWidth type='submit'>
        Log In
      </Button>
    </FormLayout>
  );
};

export default Login;
