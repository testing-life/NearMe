import React, { FormEvent, useEffect, useState } from "react";
import { auth } from "../../Firebase/Firebase";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { LOG_IN } from "../../Consts/Routes";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createUserWithEmailAndPassword, user, , error] =
    useCreateUserWithEmailAndPassword(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(LOG_IN);
    }
  }, [user]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUserWithEmailAndPassword(email, password);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          required
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          required
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        {error && <p>{error.message}</p>}
        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default Signup;
