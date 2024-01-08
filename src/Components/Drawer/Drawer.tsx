import React, { FC } from 'react';

interface Props {
  isOpen: boolean;
}

const Drawer: FC<Props> = ({ isOpen }) => {
  return <div className={`${isOpen ? '-is-open' : ''}`}>Drawer</div>;
};

export default Drawer;
