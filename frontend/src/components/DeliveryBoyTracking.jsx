import React from "react";
import scooter from "../assets/rider.png";
import home from "../assets/home.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
const deliveryBoyIcon = new L.icon({
  //creating icon
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = new L.icon({
  //creating icon
  iconUrl: home,
  iconSize: [60, 60],
  iconAnchor: [20, 40],
});
const DeliveryBoyTracking = ({ data }) => {
  if (!data?.deliveryBoyLocation || !data?.customerLocation) {
    return <p>Loading map...</p>;
  }
  const deliveryBoyLat = data?.deliveryBoyLocation?.lat;
  const deliveryBoyLon = data?.deliveryBoyLocation?.lon;

  const customerLat = data?.customerLocation?.lat;
  const customerLon = data?.customerLocation?.lon;

  const path = [
    [deliveryBoyLat, deliveryBoyLon],
    [customerLat, customerLon],
  ];

  const center = [deliveryBoyLat, deliveryBoyLon];

  return (
    <div className="w-full h-100 mt-3 rounded-xl overflow-hidden shadow-md">
      <MapContainer className={"w-full h-full"} center={center} zoom={16}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[deliveryBoyLat, deliveryBoyLon]}
          icon={deliveryBoyIcon}
        >
          <Popup>Delivery partner</Popup>
        </Marker>

        <Marker position={[customerLat, customerLon]} icon={customerIcon}>
          <Popup>Home</Popup>
        </Marker>

        <Polyline positions={path} color="#e84855" weight={4}></Polyline>
      </MapContainer>
    </div>
  );
};

export default DeliveryBoyTracking;
