import { FC, FormEvent, useState } from 'react';
import Input from '../Input/Input';
import FormLayout from '../FormLayout/FormLayout';
import Button from '../Button/Button';

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
      <p className='mb-12'>
        Enter an email address to receive a reset password request.
      </p>
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
        <Button fullWidth type='submit'>
          Request reset email
        </Button>
      </FormLayout>
    </>
  );
};

export default ResetPassword;
