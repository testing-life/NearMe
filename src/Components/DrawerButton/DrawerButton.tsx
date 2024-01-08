import React, { FC } from 'react';
import './DrawerButton.css';
import { ReactComponent as Hamburger } from '../../Assets/Icons/hamburger.svg';
interface Props {
  onClick: () => void;
}
const DrawerButton: FC<Props> = ({ onClick }) => {
  return (
    <button onClick={onClick} className='drawer-trigger'>
      <Hamburger focusable='false' />
      <span className='invisible'>Navigation toggle</span>
    </button>
  );
};

export default DrawerButton;
