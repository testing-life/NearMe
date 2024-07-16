import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { EDIT } from '../../Consts/Routes';
import { ISpot } from '../../Models/spot';
import Spot from '../Spot/Spot';
import { DocumentReference } from 'firebase/firestore';
import './ListView.css';
import { ReactComponent as Bin } from '../../Assets/Icons/trash.svg';
import { ReactComponent as Pencil } from '../../Assets/Icons/pen.svg';
import Dialog from '../Dialog/Dialog';
import Button from '../Button/Button';

interface Props {
  deleteHandler: (ref: DocumentReference, imageUrl?: string) => void;
  filteredData: ISpot[];
}

const ListView: FC<Props> = ({ filteredData, deleteHandler }) => {
  const [trulyDelete, setTrulyDelete] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState<ISpot>();

  const onDeletePrompt = (spot: ISpot) => {
    setSpotToDelete(spot);
    setTrulyDelete(true);
  };

  const onDeleteCancel = () => {
    setSpotToDelete(undefined);
    setTrulyDelete(false);
  };

  const onDeleteConfirm = () => {
    if (trulyDelete && spotToDelete) {
      deleteHandler(spotToDelete.ref, spotToDelete?.poster.url);
      setSpotToDelete(undefined);
      setTrulyDelete(false);
    }
  };

  return (
    <>
      <ul className='spots-list'>
        {filteredData.map((spot: ISpot, index: number) => (
          <li className='spots-list__item' key={spot.id}>
            <Spot spot={spot}>
              {spot?.id && (
                <Link
                  className='spot__edit'
                  title='edit post'
                  state={{ id: spot.id }}
                  to={EDIT}
                >
                  <Pencil />
                  <span className='invisible'> Edit post</span>
                </Link>
              )}
              <button
                className='spot__delete'
                onClick={() => onDeletePrompt(spot)}
              >
                <Bin />
                <span className='invisible'>Tap twice to delete post</span>
              </button>
            </Spot>
          </li>
        ))}
      </ul>
      <Dialog isOpen={trulyDelete}>
        <div className='delete__content column'>
          <p className='-is-warning mb-32'>Are you sure?</p>
          <div className='delete__controls'>
            <Button clickHandler={onDeleteCancel}>Cancel</Button>
            <Button classes='-is-danger' clickHandler={onDeleteConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ListView;
