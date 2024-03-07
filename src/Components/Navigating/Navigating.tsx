import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
declare let L: any;

const SetNavigation = ({ source, destination }: any) => {
  const map = useMap();

  useEffect(() => {
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(parseFloat(source.lat), parseFloat(source.lng)),
        L.latLng(parseFloat(destination.lat), parseFloat(destination.lng))
      ],
      routeWhileDragging: true,
      show: true,
      addWaypoints: true,
      fitSelectedRoutes: true
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [source, destination, map]);

  return null;
};

export default SetNavigation;
