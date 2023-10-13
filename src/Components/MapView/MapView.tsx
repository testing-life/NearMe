import React, { FC, useEffect } from "react";
import { Map } from "../Map/Map";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { ISpot } from "../../Models/spot";
import useGeolocation from "../../Hooks/useGeolocation";
import { LatLngExpression } from "leaflet";

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

  const zoomLevel = 15;
  return (
    <>
      <MapContainer
        zoom={zoomLevel}
        center={{ lat: location.latitude, lng: location.longitude }}
        scrollWheelZoom={true}
        style={{ height: "200px" }}
      >
        <>{console.log("location", location)}</>
        <SetView
          location={{ lat: location.latitude, lng: location.longitude }}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={{ lat: location.latitude, lng: location.longitude }}>
          <Popup>
            Omu-Aran the Head Post of Igbomina land, is a town in the Nigerian
            state of Kwara. It originated from Ife and currently the local
            government headquarters of Irepodun local government.
          </Popup>
        </Marker>
      </MapContainer>
      {locationError && <p>{locationError.message}</p>}
    </>
  );
};

export default MapView;
