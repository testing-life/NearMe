import React, { useState } from 'react';
import { useUpdateEmail, useUpdatePassword } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';
import { HOME } from '../Consts/Routes';
import { auth } from '../Firebase/Firebase';
import UpdateCredentials from '../Components/UpdateCredentials/UpdateCredentials';
import Spinner from '../Components/Spinner/Spinner';

const UpdateCredentialsPage = () => {
  const [updateEmail, emailUpdating, emailError] = useUpdateEmail(auth);
  const [updatePassword, passUpdating, passError] = useUpdatePassword(auth);
  const [success, setSuccess] = useState('');

  const onSubmitEmail = async (credential: string) => {
    const success = await updateEmail(credential);
    if (success) {
      setSuccess('Email updated successfully');
    }
  };

  const onSubmitPassword = async (credential: string) => {
    const success = await updatePassword(credential);
    if (success) {
      setSuccess('Password updated successfully');
    }
  };

  return (
    <div className='desktop-width-limit'>
      <div className='mb-48'>
        <div className='mb-12'>
          <UpdateCredentials type='password' submitHandler={onSubmitPassword} />
        </div>
        <div className='mb-12'>
          {passUpdating && <Spinner label='Updating password' />}
        </div>
        <div className='mb-12'>
          {passError && <p className='-is-error'>{passError.message}</p>}
        </div>
      </div>
      <div className='mb-48'>
        <div className='mb-12'>
          <UpdateCredentials type='email' submitHandler={onSubmitEmail} />
        </div>
        <div className='mb-12'>
          {emailUpdating && <Spinner label='Updating email' />}
        </div>
        <div className='mb-12'>
          {emailError && <p className='-is-error'>{emailError.message}</p>}
        </div>
      </div>
      {success && <p className='-is-success mb-32'>{success}</p>}
      <Link to={HOME}>Back</Link>
    </div>
  );
};

export default UpdateCredentialsPage;
