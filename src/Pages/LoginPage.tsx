import { browserLocalPersistence } from 'firebase/auth';
import { useEffect } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom';
import Login from '../Components/Login/Login';
import { HOME, RESET, SIGN_UP } from '../Consts/Routes';
import { auth } from '../Firebase/Firebase';
import './LoginPage.css';
import Spinner from '../Components/Spinner/Spinner';

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
    await auth.setPersistence(browserLocalPersistence);
    signInWithEmailAndPassword(email, password);
  };

  return (
    <div className='login-page'>
      <div className='column -space-bottom'>
        <div className='-space-bottom'>
          <Login submitHandler={onSubmit} />
        </div>
        {error && <p className='-is-error'>{error.message}</p>}
      </div>
      {loading && (
        <div className='row -is-centred-h'>
          <Spinner label='Signing in' />
        </div>
      )}
      {!loading && (
        <>
          <div className='column -is-centred-v -has-spearator'>
            <p>No account?</p>
            <Link className='' to={SIGN_UP}>
              Sign up
            </Link>
          </div>
          <div className='column -is-centred-v'>
            <p>Forgot your password ?</p>
            <Link className='' to={RESET}>
              Reset password
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginPage;
