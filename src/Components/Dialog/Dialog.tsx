import React, { FC, ReactNode, useEffect, useRef } from 'react';
import './Dialog.css';

interface Props {
  children: ReactNode;
  isOpen: boolean;
}

const Dialog: FC<Props> = ({ children, isOpen }) => {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (dialog.current) {
      if (isOpen) {
        dialog.current.showModal();
      } else {
        dialog.current.close();
      }
    }
  }, [isOpen]);

  return (
    <dialog className='dialog' ref={dialog}>
      {children}
    </dialog>
  );
};

export default Dialog;
