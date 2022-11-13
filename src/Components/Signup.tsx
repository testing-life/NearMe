import React, { FormEvent, useState } from "react";
import { auth } from "../Firebase/Firebase";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createUserWithEmailAndPassword, error] =
    useCreateUserWithEmailAndPassword(auth);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await createUserWithEmailAndPassword(email, password);
    if (res) {
      // redirect
    }
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
        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default Signup;
