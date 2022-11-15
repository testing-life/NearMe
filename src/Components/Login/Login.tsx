import React, { FormEvent, useEffect, useState } from "react";
import { auth } from "../../Firebase/Firebase";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { HOME } from "../../Consts/Routes";

const Login = () => {
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate(HOME);
    }
  }, [user]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(email, password);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input
          required
          id="email"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          required
          id="password"
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button type="submit">Log In</button>
      </form>
    </>
  );
};

export default Login;
