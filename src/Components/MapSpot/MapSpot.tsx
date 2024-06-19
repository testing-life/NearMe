import React, { FC } from 'react';
import { ReactComponent as BigClose } from '../../Assets/Icons/big-close.svg';
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
      <div className='map-spot__utils'>
        <button className='map-spot__close' onClick={closeHandler}>
          <BigClose />
        </button>
      </div>
      <button onClick={() => navigationHandler(spot.location)}>
        Show route
      </button>
      <button onClick={() => navigationHandler(undefined)}>Clear route</button>
      <div className='mb-12'>
        <PillsList labels={spot.tags} />
      </div>
      <div className='map-spot__details'>
        <p className='map-spot__name'>{spot.name}</p>
        <p className='map-spot__address'>{spot.address}</p>
      </div>
      {spot.poster.url && (
        <img className='map-spot__poster' src={spot.poster.url} alt='' />
      )}
    </div>
  );
};

export default MapSpot;
