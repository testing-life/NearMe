import React, { FC, ReactNode, useEffect, useRef } from 'react';
import './Dialog.css';

interface Props {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Dialog: FC<Props> = ({ children, isOpen, onClose }) => {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (dialog.current) {
      if (isOpen) {
        dialog.current.showModal();
      } else {
        dialog.current.close();
        onClose();
      }
    }
  }, [isOpen]);

  const closeHandler = () => {
    if (dialog.current) {
    }
  };

  return (
    <dialog className='dialog' ref={dialog}>
      <div>
        <button onClick={closeHandler}>close</button>
      </div>
      {children}
    </dialog>
  );
};

export default Dialog;
