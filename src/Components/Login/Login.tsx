import React, { ChangeEvent, FC, FormEvent, useState } from 'react';
import Input from '../Input/Input';

interface Props {
  submitHandler: (email: string, password: string) => void;
  classes?: string;
}

const Login: FC<Props> = ({ submitHandler, classes }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitHandler(email, password);
  };

  return (
    <>
      <form onSubmit={onSubmit} className={`${classes}`}>
        <div className='input-control'>
          <Input
            id='email'
            required
            label='Email'
            type='email'
            placeholder='email@example.com'
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        </div>
        <div className='input-control'>
          <Input
            id='password'
            required
            label='Password'
            type='password'
            placeholder='password'
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        </div>
        <button className='bg-yellow-300' type='submit'>
          Log In
        </button>
      </form>
    </>
  );
};

export default Login;
