import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export const Map = () => {
  const position = { lat: 8.1386, lng: 5.1026 };
  const zoomLevel = 15;

  return (
    <MapContainer
      zoom={zoomLevel}
      center={position}
      scrollWheelZoom={true}
      style={{ height: "200px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          Omu-Aran the Head Post of Igbomina land, is a town in the Nigerian
          state of Kwara. It originated from Ife and currently the local
          government headquarters of Irepodun local government.
        </Popup>
      </Marker>
    </MapContainer>
  );
};
