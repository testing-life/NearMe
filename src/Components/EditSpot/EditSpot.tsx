import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import useGeolocation from '../../Hooks/useGeolocation';
import useReverseGeocode from '../../Hooks/useReverseGeocode';
import { ISpot } from '../../Models/spot';
import { GeoPoint } from 'firebase/firestore';
import useTagsStore from '../../Stores/tagsStore';
import TagFilter from '../TagFilter/TagFilter';
import Button from '../Button/Button';
import Input from '../Input/Input';
import { ReactComponent as Locate } from '../../Assets/Icons/locate.svg';
import { isDefaultLocation } from '../../Utils/geo';
import { Link } from 'react-router-dom';
import { HOME } from '../../Consts/Routes';
import './EditSpot.css';

interface Props {
  editHandler: (spot: ISpot) => void;
  data: ISpot;
  userId: string;
}

const EditSpot: FC<Props> = ({ editHandler, data, userId }) => {
  const [spot, setSpot] = useState(data);
  const { location, locationError, getLocation } = useGeolocation();
  const { address, getAddress, addressError } = useReverseGeocode();
  const [isSearching, setIsSearching] = useState(false);
  const tags = useTagsStore((state) => state.tags);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    editHandler(spot);
  };

  useEffect(() => {
    if (location.latitude && location.longitude) {
      const geopoint = new GeoPoint(location.latitude, location.longitude);
      setSpot({ ...spot, location: geopoint });
      getAddress(location);
    }
  }, [location]);

  useEffect(() => {
    if (Object.keys(address).length) {
      setSpot({ ...spot, address: address.formatted });
      setIsSearching(false);
    }
  }, [address]);

  const guessAddress = (): void => {
    setIsSearching(true);
    getLocation();
  };

  const taggingHandler = (filterList: (typeof tags)[][number]): void => {
    setSpot({ ...spot, tags: filterList });
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <ul>
          <li className='mb-32'>
            <Input
              id='place'
              label='Name'
              type='text'
              placeholder='Name'
              value={spot.name}
              onChange={(value: string) => setSpot({ ...spot, name: value })}
            />
          </li>
          <li className='mb-32'>
            <TagFilter clickHandler={taggingHandler} />
          </li>
          <li className='row mb-32 locate-container'>
            <div>
              <Input
                id='address'
                required
                label='Address'
                type='text'
                placeholder='Locate me'
                value={spot.address}
                onChange={(value: string) =>
                  setSpot({ ...spot, address: value })
                }
              />
            </div>
            <div className='mb-32'>
              <Button
                classes='add-spot__locate-btn'
                type='button'
                clickHandler={guessAddress}>
                <Locate />
              </Button>
            </div>
            <div>
              {locationError && (
                <p className='-is-error'>{locationError.message}</p>
              )}
              {isDefaultLocation(location) && (
                <p className='-is-warning'>
                  You may need to enable Location Services of your device.
                </p>
              )}
              {addressError && (
                <p className='-is-error'>{addressError.message}</p>
              )}
            </div>
          </li>
          {/* <textarea
          placeholder='Notes'
          value={spot.notes}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setSpot({ ...spot, notes: e.target.value })
          }
        /> */}
          <li>
            <Button fullWidth variant='highlight' type='submit'>
              Add spot
            </Button>
          </li>
        </ul>
      </form>
      <Link className='edit-spot__cancel' to={HOME}>
        Cancel
      </Link>
    </>
  );
};

export default EditSpot;
