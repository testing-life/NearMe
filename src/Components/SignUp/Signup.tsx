import React, { FormEvent, useEffect, useState } from "react";
import { auth, db } from "../../Firebase/Firebase";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { LOG_IN } from "../../Consts/Routes";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  setDoc,
} from "firebase/firestore";
import { Profile } from "../../Models/profile";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createUserWithEmailAndPassword, user, , createUserError] =
    useCreateUserWithEmailAndPassword(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      createProfile(user);
    }
  }, [user]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUserWithEmailAndPassword(email, password);
  };

  const createProfile = async (user: any): Promise<void> => {
    await setDoc(doc(db, "users", user.user.uid), {
      ...Profile.create(),
      email,
    }).catch((error: Error) => console.error(error.message));
    navigate(LOG_IN);
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
        {createUserError && <p>{createUserError.message}</p>}
        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default Signup;
