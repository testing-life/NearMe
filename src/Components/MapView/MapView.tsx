import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap
} from 'react-leaflet';
import { ISpot } from '../../Models/spot';
import useGeolocation, { Ilocation } from '../../Hooks/useGeolocation';
import { distanceMetres } from '../../Utils/geo';
import SetNavigation from '../Navigating/Navigating';
declare let L: any;

interface Props {
  filteredData: ISpot[];
}

const SetView = ({
  location: { lat, lng }
}: {
  location: { lat: number; lng: number };
}) => {
  const map = useMap();
  if (lat && lng) {
    map.setView({ lat, lng }, map.getZoom());
  }
  return null;
};

const MapView: FC<Props> = ({ filteredData }) => {
  const { location, locationError, getLocation } = useGeolocation();
  const [radiusMetres, setRadiusMetres] = useState(500);
  const [destination, setDestination] = useState<Ilocation>();
  const fillBlueOptions = { fillColor: 'blue' };

  useEffect(() => {
    getLocation();
  }, []);

  const zoom = 15;
  return (
    <>
      <label htmlFor='searchRange'>Distance</label>
      <input
        id='searchRange'
        type='range'
        step='1'
        max='5000'
        min='5'
        onChange={(e: ChangeEvent) =>
          setRadiusMetres(parseInt((e.target as HTMLInputElement).value))
        }
      />
      <button onClick={() => setDestination(undefined)}>Clear route</button>
      <MapContainer
        zoom={zoom}
        center={{ lat: location.latitude, lng: location.longitude }}
        scrollWheelZoom={true}
        style={{ height: '80vh' }}>
        <SetView
          location={{ lat: location.latitude, lng: location.longitude }}
        />
        {destination && (
          <SetNavigation
            source={{ lat: location.latitude, lng: location.longitude }}
            destination={{
              lat: destination.latitude,
              lng: destination.longitude
            }}
          />
        )}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={{ lat: location.latitude, lng: location.longitude }}>
          <Popup>That's you.</Popup>
        </Marker>
        {filteredData
          .filter((spot: ISpot) => {
            const range = distanceMetres(
              location.latitude,
              location.latitude,
              spot.location.latitude,
              spot.location.latitude
            );
            // TODO fix range & metres, make more precise
            if (Math.floor(range) <= radiusMetres) {
              return spot;
            }
          })
          .map((spot: ISpot, index: number) => {
            return (
              <Marker
                key={`${spot.name}${index}`}
                position={{
                  lat: spot.location.latitude,
                  lng: spot.location.longitude
                }}>
                <Popup>
                  <p>{spot.name}</p>
                  <p>{spot.address}</p>
                  <button onClick={() => setDestination(spot.location)}>
                    Show route
                  </button>
                </Popup>
              </Marker>
            );
          })}
        {location.latitude !== 0 && (
          <Circle
            center={[location.latitude, location.longitude]}
            pathOptions={fillBlueOptions}
            radius={radiusMetres}
          />
        )}
      </MapContainer>
      {locationError && <p>{locationError.message}</p>}
    </>
  );
};

export default MapView;
