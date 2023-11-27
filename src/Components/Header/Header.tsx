import { Auth } from 'firebase/auth';
import React, { FC, ReactNode } from 'react';
import { useSignOut } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';
import { UPDATE } from '../../Consts/Routes';
import './Header.css';

interface Props {
  auth: Auth;
  children?: ReactNode;
}

const Header: FC<Props> = ({ auth, children }) => {
  const [signOut, loading, error] = useSignOut(auth);
  return (
    <header className='header'>
      <ul className='u-flex u-gap-4  u-items-baseline nav-right'>
        {children && <li>{children}</li>}
        <li>
          <Link className='btn bg-yellow-300' to={UPDATE}>
            Update Details
          </Link>
        </li>
        <li className='--to-right'>
          <button
            className='bg-danger text-light'
            onClick={async () => await signOut()}>
            Log out
          </button>
        </li>
      </ul>
    </header>
  );
};

export default Header;
