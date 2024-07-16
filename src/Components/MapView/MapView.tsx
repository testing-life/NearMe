import React, { FC, useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { ISpot } from '../../Models/spot';
import useGeolocation, { Ilocation } from '../../Hooks/useGeolocation';
import SetNavigation from '../Navigating/Navigating';
import Pin from '../../Assets/pin.svg';
import YouPin from '../../Assets/youPin.svg';
import OthersPin from '../../Assets/othersPin.svg';
import { Icon } from 'leaflet';
import './MapView.css';
import MapSpot from '../MapSpot/MapSpot';
import { DataType } from '../../Pages/HomePage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../Firebase/Firebase';

interface Props {
  filteredData: ISpot[];
  dataType?: DataType;
}

const SetView = ({
  location: { lat, lng },
}: {
  location: { lat: number; lng: number };
}) => {
  const map = useMap();
  if (lat && lng) {
    map.setView({ lat, lng }, map.getZoom());
  }
  return null;
};

const MapView: FC<Props> = ({ filteredData, dataType }) => {
  const { location, locationError, getLocation } = useGeolocation();
  const [destination, setDestination] = useState<Ilocation>();
  const [openSpot, setOpenSpot] = useState<ISpot>();
  const [user] = useAuthState(auth);

  const spotIcon = new Icon({
    iconUrl: Pin,
    iconSize: [32, 38],
    iconAnchor: [32, 38],
    popupAnchor: [-100, -100],
  });

  const youIcon = new Icon({
    iconUrl: YouPin,
    iconSize: [37, 43],
    iconAnchor: [37, 43],
    popupAnchor: [-3, -76],
  });

  const othersIcon = new Icon({
    iconUrl: OthersPin,
    iconSize: [37, 43],
    iconAnchor: [37, 43],
    popupAnchor: [-3, -76],
  });

  useEffect(() => {
    getLocation();
  }, []);

  const zoom = 15;
  return (
    <>
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
        style={{ blockSize: '80vh' }}
      >
        <SetView
          location={{ lat: location.latitude, lng: location.longitude }}
        />
        {destination && (
          <SetNavigation
            source={{ lat: location.latitude, lng: location.longitude }}
            destination={{
              lat: destination.latitude,
              lng: destination.longitude,
            }}
          />
        )}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker
          icon={youIcon}
          position={{
            lat: location.latitude,
            lng: location.longitude,
          }}
        ></Marker>
        {filteredData.map((spot: ISpot, index: number) => {
          return (
            <Marker
              eventHandlers={{
                click: () => setOpenSpot(spot),
              }}
              key={`${spot.name}${index}`}
              icon={spot.userId === user?.uid ? spotIcon : othersIcon}
              position={{
                lat: spot.location.latitude,
                lng: spot.location.longitude,
              }}
            ></Marker>
          );
        })}
      </MapContainer>
      {openSpot && (
        <MapSpot
          spot={openSpot}
          navigationHandler={(toggle: any) => setDestination(toggle)}
          closeHandler={() => setOpenSpot(undefined)}
        />
      )}
    </>
  );
};

export default MapView;
