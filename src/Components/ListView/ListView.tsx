import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { EDIT } from '../../Consts/Routes';
import { ISpot } from '../../Models/spot';
import Spot from '../Spot/Spot';
import { DocumentReference } from 'firebase/firestore';

interface Props {
  deleteHandler: (ref: DocumentReference) => void;
  filteredData: ISpot[];
}

const ListView: FC<Props> = ({ filteredData, deleteHandler }) => {
  return (
    <ul className='ml-0 p-0 spots-list'>
      {filteredData.map((spot: ISpot) => (
        <li key={spot.id}>
          <Spot spot={spot}>
            {spot?.id && (
              <Link
                className='btn-link btn-primary outline'
                state={{ id: spot.id }}
                to={EDIT}>
                Edit
              </Link>
            )}
            <button
              className='btn-link bg-orange-2 outline'
              onClick={() => deleteHandler(spot.ref)}>
              Delete
            </button>
          </Spot>
        </li>
      ))}
    </ul>
  );
};

export default ListView;
