import { FC, FormEvent, useEffect, useState } from 'react';
import useGeolocation from '../../Hooks/useGeolocation';
import useReverseGeocode from '../../Hooks/useReverseGeocode';
import { ISpot } from '../../Models/spot';
import { Firestore, GeoPoint } from 'firebase/firestore';
import useTagsStore from '../../Stores/tagsStore';
import TagFilter from '../TagFilter/TagFilter';
import Button from '../Button/Button';
import Input from '../Input/Input';
import { ReactComponent as Locate } from '../../Assets/Icons/locate.svg';
import { isDefaultLocation } from '../../Utils/geo';
import { Link } from 'react-router-dom';
import { HOME } from '../../Consts/Routes';
import { ReactComponent as Pencil } from '../../Assets/Icons/pen.svg';
import './EditSpot.css';
import Textarea from '../Textarea/Textarea';
import CustomTag from '../CustomTag/CustomTag';
import { saveTagToSpot } from '../../Utils/tags';

interface Props {
  editHandler: (spot: ISpot) => void;
  data: ISpot;
  userId: string;
  db: Firestore;
}

const EditSpot: FC<Props> = ({ editHandler, data, userId, db }) => {
  const [spot, setSpot] = useState(data);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const { location, locationError, getLocation } = useGeolocation();
  const { address, getAddress, addressError } = useReverseGeocode();
  const tags = useTagsStore((state) => state.tags);
  const updateTags = useTagsStore((state) => state.updateTags);

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
    }
  }, [address]);

  useEffect(() => {
    if (spot.tags.length) {
      updateTags(spot.tags);
    }
  }, []);

  const guessAddress = (): void => {
    getLocation();
  };

  const taggingHandler = (filterList: (typeof tags)[][number]): void => {
    setSpot({ ...spot, tags: filterList });
  };

  return (
    <>
      <div className='mb-32'>
        <CustomTag
          tagHandler={(tag: string) => saveTagToSpot(tag, userId, db)}
        />
      </div>
      <form onSubmit={onSubmit}>
        <fieldset>
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
            {!isEditingAddress ? (
              <li className='row mb-32 edit-spot__address-container'>
                <p>{spot.address}</p>
                <Button
                  variant='icon'
                  clickHandler={() => setIsEditingAddress(!isEditingAddress)}>
                  <Pencil />
                  <span className='invisible'> Edit address</span>
                </Button>
              </li>
            ) : (
              <li className='row mb-32 locate-container'>
                <div>
                  <Textarea
                    id='address'
                    required
                    label='Address'
                    value={spot.address}
                    onChange={(value: string) =>
                      setSpot({ ...spot, address: value })
                    }
                  />
                </div>
                <div>
                  <Button
                    variant='icon'
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
            )}
            {/* <textarea
          placeholder='Notes'
          value={spot.notes}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setSpot({ ...spot, notes: e.target.value })
          }
        /> */}
            <li>
              <Button fullWidth variant='highlight' type='submit'>
                Edit spot
              </Button>
            </li>
          </ul>
        </fieldset>
      </form>
      <Link className='edit-spot__cancel' to={HOME}>
        Cancel
      </Link>
    </>
  );
};

export default EditSpot;
