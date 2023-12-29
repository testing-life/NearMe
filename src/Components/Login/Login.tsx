import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import Input from "../Input/Input";
import FormLayout from "../FormLayout/FormLayout";
import Button from "../Button/Button";

interface Props {
  submitHandler: (email: string, password: string) => void;
}

const Login: FC<Props> = ({ submitHandler }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitHandler(email, password);
  };

  return (
    <FormLayout onSubmit={onSubmit}>
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
      <Button fullWidth type="submit">
        Log In
      </Button>
    </FormLayout>
  );
};

export default Login;
