import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import Input from "../Input/Input";

interface Props {
  submitHandler: (value: string) => void;
  type: "email" | "password";
  action?: "update" | "reset";
}

const UpdateCredentials: FC<Props> = ({
  submitHandler,
  type,
  action = "update",
}) => {
  const [credential, setCredential] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitHandler(credential);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <Input
          id={type}
          required
          label={`${action} ${type}`}
          type={type}
          placeholder={`New ${type}`}
          value={credential}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setCredential(e.target.value)
          }
        />
        <button type="submit">Update {type}</button>
      </form>
    </>
  );
};

export default UpdateCredentials;
