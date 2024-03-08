import React, { FC } from 'react';
import './MapSpot.css';

import { ISpot } from '../../Models/spot';
import { Ilocation } from '../../Hooks/useGeolocation';
import PillsList from '../PillsList/PillsList';
interface Props {
  spot: ISpot;
  closeHandler: () => void;
  navigationHandler: (location?: Ilocation) => void;
}

const MapSpot: FC<Props> = ({ spot, closeHandler, navigationHandler }) => {
  return (
    <div className='map-spot'>
      <button onClick={closeHandler}>close</button>
      <p>{spot.address}</p>
      <button onClick={() => navigationHandler(spot.location)}>
        Show route
      </button>
      <button onClick={() => navigationHandler(undefined)}>Clear route</button>
      <>{console.log('spot', spot)}</>
      <PillsList labels={spot.tags} />
      <p>{spot.name}</p>
      {spot.poster.url && (
        <img className='map-spot__poster' src={spot.poster.url} alt='' />
      )}
    </div>
  );
};

export default MapSpot;
