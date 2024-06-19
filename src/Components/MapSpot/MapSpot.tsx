import React, { FC, useState } from 'react';
import { ReactComponent as BigClose } from '../../Assets/Icons/big-close.svg';
import { ReactComponent as Route } from '../../Assets/Icons/route.svg';
import './MapSpot.css';

import { ISpot } from '../../Models/spot';
import { Ilocation } from '../../Hooks/useGeolocation';
import PillsList from '../PillsList/PillsList';
import Button from '../Button/Button';

interface Props {
  spot: ISpot;
  closeHandler: () => void;
  navigationHandler: (location?: Ilocation) => void;
}

const MapSpot: FC<Props> = ({ spot, closeHandler, navigationHandler }) => {
  const [isNavigating, setIsNavigating] = useState(false);

  const navigationTrigger = () => {
    if (isNavigating) {
      setIsNavigating(false);
      navigationHandler(undefined);
    } else {
      setIsNavigating(true);
      navigationHandler(spot.location);
    }
  };

  return (
    <div className='map-spot'>
      <div className='map-spot__utils'>
        <Button classes='map-spot__nav-btn' clickHandler={navigationTrigger}>
          {isNavigating ? 'Clear' : 'Show'} route
          <Route />
        </Button>
        {!isNavigating && (
          <button className='map-spot__close' onClick={closeHandler}>
            <BigClose />
          </button>
        )}
      </div>
      {!isNavigating && (
        <div className='mb-12'>
          <PillsList labels={spot.tags} />
        </div>
      )}
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
