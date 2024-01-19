import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import useGeolocation from '../../Hooks/useGeolocation';
import useReverseGeocode from '../../Hooks/useReverseGeocode';
import { ISpot } from '../../Models/spot';
import { GeoPoint } from 'firebase/firestore';
import TagButton from '../TagButton/TagButton';
import useTagsStore from '../../Stores/tagsStore';

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

  return (
    <>
      <form onSubmit={onSubmit}>
        <label htmlFor='place'>Name</label>
        <input
          type='text'
          id='place'
          value={spot.name}
          placeholder="Place's name"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSpot({ ...spot, name: e.target.value })
          }
        />
        <div>
          <>
            <div>Tags:</div>
            {/* TODO fix tag adding/removing */}
            {tags.map((tag: (typeof tags)[number], index: number) => {
              return !spot.tags.includes(tag) ? (
                <TagButton
                  tagLabel={tag}
                  key={`${tag}${index}`}
                  clickHandler={() =>
                    setSpot({ ...spot, tags: [...spot.tags, tag] })
                  }
                />
              ) : (
                <TagButton
                  remove
                  isSelected
                  tagLabel={tag}
                  key={`${tag}${index}`}
                  clickHandler={() =>
                    setSpot({
                      ...spot,
                      tags: spot.tags.filter((t) => t !== tag)
                    })
                  }
                />
              );
            })}
          </>
        </div>
        <div>
          <label htmlFor='address'>Address</label>
          <input
            value={spot.address}
            type='string'
            placeholder='This places address'
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSpot({ ...spot, address: e.target.value })
            }
          />
          <button type='button' onClick={guessAddress}>
            Guess address
          </button>
          {locationError && <p>{locationError.message}</p>}
          {addressError && <p>{addressError.message}</p>}
          {isSearching && <p>Looking up address...</p>}
        </div>
        <textarea
          placeholder='Notes'
          value={spot.notes}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setSpot({ ...spot, notes: e.target.value })
          }
        />
        <button type='submit'>Edit</button>
      </form>
    </>
  );
};

export default EditSpot;
