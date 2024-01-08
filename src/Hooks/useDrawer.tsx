import { useState } from 'react';

interface DrawerProps {
  drawerOpen: boolean;
  toggleDrawer: () => void;
}

const useDrawer = (): DrawerProps => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {};
  return { drawerOpen: isOpen, toggleDrawer };
};

export default useDrawer;
