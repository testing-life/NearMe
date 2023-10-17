import React, { ChangeEvent, FC, useEffect, useState } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { ISpot } from "../../Models/spot";
import useGeolocation from "../../Hooks/useGeolocation";

interface Props {
  filteredData: ISpot[];
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

const MapView: FC<Props> = ({ filteredData }) => {
  const { location, locationError, getLocation } = useGeolocation();
  const [radiusMetres, setRadiusMetres] = useState(500);
  const fillBlueOptions = { fillColor: "blue" };

  useEffect(() => {
    getLocation();
  }, []);

  const distance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
    const r = 6371; // km
    const p = Math.PI / 180;

    const a =
      0.5 -
      Math.cos((lat2 - lat1) * p) / 2 +
      (Math.cos(lat1 * p) *
        Math.cos(lat2 * p) *
        (1 - Math.cos((lon2 - lon1) * p))) /
        2;

    return 2 * r * Math.asin(Math.sqrt(a));
  };
  const zoom = 15;
  return (
    <>
      <label htmlFor="searchRange">Distance</label>
      <input
        id="searchRange"
        type="range"
        step="1"
        max="5000"
        min="500"
        onChange={(e: ChangeEvent) =>
          setRadiusMetres(parseInt((e.target as HTMLInputElement).value))
        }
      />
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
              <>
                {console.log(
                  "first",
                  distance(
                    location.latitude,
                    location.latitude,
                    spot.location.latitude,
                    spot.location.latitude
                  )
                )}
              </>
              <Popup>
                <p>{spot.name}</p>
                <p>{spot.address}</p>
              </Popup>
            </Marker>
          );
        })}
        <>
          {console.log(
            "location.latitude, location.longitude",
            location.latitude,
            location.longitude
          )}
        </>
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
