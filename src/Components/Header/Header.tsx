import { Auth } from "firebase/auth";
import React, { FC } from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { UPDATE } from "../../Consts/Routes";

interface Props {
  auth: Auth;
}

const Header: FC<Props> = ({ auth }) => {
  const [signOut, loading, error] = useSignOut(auth);
  return (
    <nav>
      <ul className="u-flex u-justify-space-between u-items-baseline">
        <li>
          <button onClick={async () => await signOut()}>Log out</button>
        </li>
        <li>
          <Link className="text-light" to={UPDATE}>
            Update Details
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
