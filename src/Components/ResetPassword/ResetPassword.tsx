import React, { ChangeEvent, FC, FormEvent, useState } from 'react';
import Input from '../Input/Input';

interface Props {
  submitHandler: (email: string) => void;
}

const ResetPassword: FC<Props> = ({ submitHandler }) => {
  const [email, setEmail] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitHandler(email);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <p>Enter an email address to receive a reset password request.</p>
        <Input
          id='email'
          required
          label='Email'
          type='email'
          placeholder='email'
          value={email}
          onChange={(value: string) => setEmail(value)}
        />
        <button type='submit'>Reset password</button>
      </form>
    </>
  );
};

export default ResetPassword;
