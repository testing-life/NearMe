import React, { FC, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { ISpot } from "../../Models/spot";
import useGeolocation from "../../Hooks/useGeolocation";

interface Props {
  filteredData: ISpot[];
}
const SetView = ({ location: { lat, lng } }: any) => {
  const map = useMap();
  if (lat && lng) {
    map.setView({ lat, lng }, 15);
  }
  return null;
};

const MapView: FC<Props> = ({ filteredData }) => {
  const { location, locationError, getLocation } = useGeolocation();

  useEffect(() => {
    getLocation();
  }, []);

  const zoom = 15;
  return (
    <>
      <MapContainer
        zoom={zoom}
        center={{ lat: location.latitude, lng: location.longitude }}
        scrollWheelZoom={true}
        style={{ height: "80vh" }}
      >
        <SetView
          location={{ lat: location.latitude, lng: location.longitude }}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
                lng: spot.location.longitude,
              }}
            >
              <Popup>
                <p>{spot.name}</p>
                <p>{spot.address}</p>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      {locationError && <p>{locationError.message}</p>}
    </>
  );
};

export default MapView;
