import { Auth } from "firebase/auth";
import React, { FC } from "react";
import { useSignOut } from "react-firebase-hooks/auth";

interface Props {
  auth: Auth;
}

const Header: FC<Props> = ({ auth }) => {
  const [signOut, loading, error] = useSignOut(auth);
  return (
    <nav>
      <button onClick={async () => await signOut()}>Log out</button>
    </nav>
  );
};

export default Header;
