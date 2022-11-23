import React, { FC, FormEvent, useState } from "react";

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
    <>
      <form onSubmit={onSubmit}>
        <ul className="no-bullets">
          <li className="row level">
            <label htmlFor="email">Email</label>
            <input
              required
              id="email"
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </li>
          <li className="row level">
            <label htmlFor="password">Password</label>
            <input
              required
              id="password"
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </li>
          <li>
            <button type="submit">Log In</button>
          </li>
        </ul>
      </form>
    </>
  );
};

export default Login;
