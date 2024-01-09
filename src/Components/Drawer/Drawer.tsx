import React, { FC, ReactNode } from 'react';
import './Drawer.css';
import DrawerButton from '../DrawerButton/DrawerButton';
import useDrawerStore from '../../Stores/drawerStore';

interface Props {
  isOpen: boolean;
  children: ReactNode;
}

const Drawer: FC<Props> = ({ isOpen, children }) => {
  const toggleDrawer = useDrawerStore((state) => state.toggleDrawer);

  return (
    <div className={`drawer ${isOpen ? '-is-open' : ''}`}>
      <DrawerButton isClose onClick={() => toggleDrawer(true)} />
      {children}
    </div>
  );
};

export default Drawer;
