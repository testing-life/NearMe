import {
  browserSessionPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useEffect } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import Login from "../Components/Login/Login";
import { HOME, RESET, SIGN_UP } from "../Consts/Routes";
import { auth } from "../Firebase/Firebase";
import Button from "../Components/Button/Button";

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
    <div className="p-1">
      <Login submitHandler={onSubmit} />
      {error && <p>{error.message}</p>}
      {loading && <p>'Signing in...</p>}
      <p>
        No account?{" "}
        <Link className="u u-LR" to={SIGN_UP}>
          Sign up
        </Link>
      </p>
      <Button fullWidth>TEst</Button>
      <p>
        Forgot your password ?{" "}
        <Link className="u u-LR" to={RESET}>
          Reset password
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
