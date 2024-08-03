import { setDoc, doc } from 'firebase/firestore';
import { useEffect } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom';
import Signup from '../Components/SignUp/Signup';
import { LOG_IN, LANDING } from '../Consts/Routes';
import { auth, db } from '../Firebase/Firebase';
import { UserCredential } from 'firebase/auth';
import Spinner from '../Components/Spinner/Spinner';
import { DefaultSpot } from '../Models/spot';

const SignupPage = () => {
  const [createUserWithEmailAndPassword, user, loading, createUserError] =
    useCreateUserWithEmailAndPassword(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      createProfile(user);
    }
  }, [user]);

  const onSubmit = async (email: string, password: string) => {
    createUserWithEmailAndPassword(email, password);
  };

  const createProfile = async ({ user }: UserCredential): Promise<void> => {
    await setDoc(doc(db, 'users', user.uid), {
      username: '',
      email: user.email,
    }).catch((error: Error) => console.error(error.message));
    navigate(LOG_IN);
  };

  return (
    <div className='column -space-bottom -desktop-width-limit'>
      <div className='-space-bottom'>
        <Signup submitHandler={onSubmit} />
      </div>
      {loading && (
        <div className='row -is-centred-h -space-bottom'>
          <Spinner label='Registering' />
        </div>
      )}
      {createUserError && (
        <p className='-is-error -space-bottom'>{createUserError.message}</p>
      )}
      <div className='column -is-centred-v'>
        <Link to={LANDING}>Back</Link>
      </div>
    </div>
  );
};

export default SignupPage;
