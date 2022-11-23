import {
  browserSessionPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { FormEvent, useEffect } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import Login from "../Components/Login/Login";
import { HOME, SIGN_UP } from "../Consts/Routes";
import { auth } from "../Firebase/Firebase";

const LoginPage = () => {
  const [signInWithEmailAndPassword, user, loading] =
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
      <p>
        No account?{" "}
        <Link className="u u-LR" to={SIGN_UP}>
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
