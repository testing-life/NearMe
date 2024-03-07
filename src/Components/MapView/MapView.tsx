import React, { FC, useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { ISpot } from '../../Models/spot';
import useGeolocation, { Ilocation } from '../../Hooks/useGeolocation';
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
  const [destination, setDestination] = useState<Ilocation>();

  useEffect(() => {
    getLocation();
  }, []);

  const zoom = 15;
  return (
    <>
      <button onClick={() => setDestination(undefined)}>Clear route</button>
      {locationError && (
        <p className='-is-error'>
          {locationError.message} {locationError.code}
        </p>
      )}

      <MapContainer
        dragging={false}
        touchZoom={true}
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
        {filteredData.map((spot: ISpot, index: number) => {
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
      </MapContainer>
    </>
  );
};

export default MapView;
