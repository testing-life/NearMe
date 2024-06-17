import React, { FC } from 'react';
import './TagButton.css';
import { ReactComponent as Tick } from '../../Assets/Icons/check.svg';
import { ReactComponent as Close } from '../../Assets/Icons/close.svg';

interface Props {
  remove?: boolean;
  tagLabel: string;
  clickHandler: () => void;
  isSelected?: boolean;
}

const TagButton: FC<Props> = ({
  remove,
  tagLabel,
  clickHandler,
  isSelected = false
}) => {
  return (
    <button
      type='button'
      className={`tag ${isSelected ? '-is-selected' : ''} ${
        remove ? '-is-remove' : '-is-add'
      } `}
      onClick={clickHandler}>
      <span className='tag__tag-label'>{tagLabel}</span>

      <i className='tag__tag-icon'>
        {isSelected ? <Tick className='--icon-large' /> : <Close />}
      </i>
    </button>
  );
};

export default TagButton;
