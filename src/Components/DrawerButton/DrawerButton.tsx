import React, { FC } from 'react';
import './DrawerButton.css';
import { ReactComponent as Hamburger } from '../../Assets/Icons/hamburger.svg';
import { ReactComponent as BigClose } from '../../Assets/Icons/big-close.svg';

interface Props {
  onClick: () => void;
  isClose?: boolean;
}
const DrawerButton: FC<Props> = ({ onClick, isClose }) => {
  return (
    <button onClick={onClick} className='drawer-trigger'>
      {isClose ? (
        <BigClose focusable='false' />
      ) : (
        <Hamburger focusable='false' />
      )}
      <span className='invisible'>Navigation toggle</span>
    </button>
  );
};

export default DrawerButton;
