import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import Input from "../Input/Input";

interface Props {
  submitHandler: (email: string, password: string) => void;
}

const Signup: FC<Props> = ({ submitHandler }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitHandler(email, password);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <Input
          id="email"
          required
          label="Email"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <Input
          id="password"
          required
          label="Password"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default Signup;
