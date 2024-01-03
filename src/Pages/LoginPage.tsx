import { browserSessionPersistence } from 'firebase/auth';
import React, { useEffect } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom';
import Login from '../Components/Login/Login';
import { HOME, RESET, SIGN_UP } from '../Consts/Routes';
import { auth } from '../Firebase/Firebase';
import './LoginPage.css';

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
    <div className='login-page'>
      <div className='row'>
        <Login submitHandler={onSubmit} />
        {error && <p>{error.message}</p>}
      </div>
      {loading && (
        <div className='row'>
          <p>Signing in...</p>
        </div>
      )}
      <div className='column -is-centred-column -has-spearator'>
        <p>No account?</p>
        <Link className='' to={SIGN_UP}>
          Sign up
        </Link>
      </div>
      <div className='column -is-centred-column'>
        <p>Forgot your password ?</p>
        <Link className='' to={RESET}>
          Reset password
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
