import { Auth } from 'firebase/auth';
import React, { FC } from 'react';
import { useSignOut } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';
import { UPDATE } from '../../Consts/Routes';
import useDrawerStore from '../../Stores/drawerStore';

interface Props {
  auth: Auth;
}

const Header: FC<Props> = ({ auth }) => {
  const [signOut, loading, error] = useSignOut(auth);
  const toggleDrawer = useDrawerStore((state) => state.toggleDrawer);
  const drawerOpen = useDrawerStore((state) => state.isOpen);
  return (
    <nav>
      <ul className='u-flex u-justify-space-between u-items-baseline'>
        <li>
          <button onClick={async () => await signOut()}>Log out</button>
        </li>
        <li>
          <button type='button' onClick={() => toggleDrawer(drawerOpen)}>
            toggledrawer
          </button>
        </li>
        <li>
          <Link className='text-light' to={UPDATE}>
            Update Details
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
