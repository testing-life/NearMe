import {
  browserSessionPersistence,
  signInWithEmailAndPassword
} from 'firebase/auth';
import React, { useEffect } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom';
import Login from '../Components/Login/Login';
import { HOME, RESET, SIGN_UP } from '../Consts/Routes';
import { auth } from '../Firebase/Firebase';

const LoginPage = () => {
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate(HOME);
    }
  }, [user]);

  const onSubmit = async (email: string, password: string) => {
    await auth.setPersistence(browserSessionPersistence);
    signInWithEmailAndPassword(email, password);
  };

  return (
    <div className='p-1 h-screen u-center u-flex u-flex-column'>
      <Login submitHandler={onSubmit} classes='mb-8' />
      {error && (
        <p className='bg-danger text-light'>
          <strong>The quick brown fox jumps over the lazy dog.</strong>
        </p>
      )}
      {loading && <div className='animated h-8 loading loading-white'></div>}
      <p>
        No account?{' '}
        <Link className='u u-LR  text-yellow-300 text-light' to={SIGN_UP}>
          Sign up
        </Link>
      </p>
      <p>
        Forgot your password ?{' '}
        <Link className='u u-LR text-yellow-300' to={RESET}>
          Reset password
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
