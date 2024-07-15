import React, { useState } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/Firebase';
import { ActionCodeSettings } from 'firebase/auth';
import ResetPassword from '../Components/ResetPassword/ResetPassword';
import { LANDING } from '../Consts/Routes';
import { Link } from 'react-router-dom';
import Spinner from '../Components/Spinner/Spinner';

const ResetPasswordPage = () => {
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);
  const [success, setSuccess] = useState('');

  const actionCodeSettings: ActionCodeSettings = {
    url: process.env.REACT_APP_CONTINUE_LINK as string,
  };

  const onSubmitPasswordReset = async (email: string) => {
    const success = await sendPasswordResetEmail(email, actionCodeSettings);
    if (success) {
      setSuccess('Email with password reset request has been sent.');
    }
  };

  return (
    <div className='desktop-width-limit'>
      <div className='mb-32'>
        <div className='mb-12'>
          <ResetPassword submitHandler={onSubmitPasswordReset} />
        </div>
        {sending && <Spinner label='Sending request email' />}
        {error && <p className='-is-error'>{error.message}</p>}
        {success && !error && !sending && (
          <p className='-is-success'>{success}</p>
        )}
      </div>
      <div className='column -is-centred-v'>
        <Link to={LANDING}>Back</Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
