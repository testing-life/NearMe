import { Auth } from 'firebase/auth';
import React, { FC } from 'react';
import useDrawerStore from '../../Stores/drawerStore';
import DrawerButton from '../DrawerButton/DrawerButton';
import { Link } from 'react-router-dom';
import { ADD } from '../../Consts/Routes';
import Button from '../Button/Button';
import './Header.css';

interface Props {
  auth: Auth;
}

const Header: FC<Props> = ({ auth }) => {
  const toggleDrawer = useDrawerStore((state) => state.toggleDrawer);
  const drawerOpen = useDrawerStore((state) => state.isOpen);
  return (
    <ul className='header'>
      <li className='header__item'>logo</li>
      <li className='header__item'>
        <Button variant='highlight'>
          <Link to={ADD}>Add Spot</Link>
        </Button>
      </li>
      <li className='header__item'>
        <DrawerButton onClick={() => toggleDrawer(drawerOpen)} />
      </li>
    </ul>
  );
};

export default Header;
