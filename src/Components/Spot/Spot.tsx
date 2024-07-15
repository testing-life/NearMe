import { FC, ReactNode } from 'react';
import { ISpot } from '../../Models/spot';
import './Spot.css';
import PillsList from '../PillsList/PillsList';
import noImage from './../../Assets/no-img.svg';
interface Props {
  spot: ISpot;
  children?: ReactNode;
}

const Spot: FC<Props> = ({ spot, children }) => {
  return (
    <article className='spot'>
      <div className='spot__tools'>{children}</div>
      <div className='spot__image-wrapper'>
        <img
          className={`${!spot.poster.url ? '-has-default' : ''} spot__image`}
          src={spot.poster.url ? spot.poster.url : noImage}
          alt=''
        />
      </div>
      <div className='spot__overlay'>
        {spot.tags.length ? (
          <div className='spot__tags'>
            <PillsList labels={spot.tags} />
          </div>
        ) : null}
        <div className='spot__details'>
          <p className='spot__title mb-12 '>{spot.name}</p>
          <span className='spot__subtitle'>{spot.address}</span>
        </div>
        {spot.notes ? (
          <div className='spot__notes'>
            <p className='leading-tight'>
              <span>{spot.notes}</span>
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
};

export default Spot;
