import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { EDIT } from '../../Consts/Routes';
import { ISpot } from '../../Models/spot';
import Spot from '../Spot/Spot';
import { DocumentReference } from 'firebase/firestore';
import './ListView.css';
import { ReactComponent as Bin } from '../../Assets/Icons/trash.svg';
import { ReactComponent as Pencil } from '../../Assets/Icons/pen.svg';

interface Props {
  deleteHandler: (ref: DocumentReference, imageUrl?: string) => void;
  filteredData: ISpot[];
}

const ListView: FC<Props> = ({ filteredData, deleteHandler }) => {
  return (
    <ul className='spots-list'>
      {filteredData.map((spot: ISpot) => (
        <li className='spots-list__item' key={spot.id}>
          <Spot spot={spot}>
            {spot?.id && (
              <Link
                className='spot__edit'
                title='edit post'
                state={{ id: spot.id }}
                to={EDIT}>
                <Pencil />
                <span className='invisible'> Edit post</span>
              </Link>
            )}
            <button
              className='spot__delete'
              onClick={() => deleteHandler(spot.ref, spot?.poster.url)}>
              <Bin />
              <span className='invisible'>Delete post</span>
            </button>
          </Spot>
        </li>
      ))}
    </ul>
  );
};

export default ListView;
