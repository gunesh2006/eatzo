import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "../redux/mapSlice";
import axios from "axios";
import { MdDeliveryDining } from "react-icons/md";
import { IoIosPhonePortrait } from "react-icons/io";
import { FaCreditCard } from "react-icons/fa";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { addMyOrder } from "../redux/userSlice";
import { PayPalButtons } from "@paypal/react-paypal-js";
import L from "leaflet";



const CheckOutPage = () => {
  const { location, address } = useSelector((state) => state.map);
  const { cartItems, totalAmount } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const amountWithDelieveryFee = totalAmount + deliveryFee;
  const navigate = useNavigate();
  const [addressinput, setAddressinput] = useState("");
  const [paymentType, setPaymentType] = useState("cod");

  const [paypalOrderId, setPaypalOrderId] = useState(null);
  const [backendOrderId, setBackendOrderId] = useState(null);
  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, lon: lng }));
    getAddressByLatLon(lat, lng).then;
  };
  function RecenterMap({ location }) {
    if (location.lat && location.lon) {
      const map = useMap();
      map.setView([location.lat, location.lon], 16, { animate: true });
    }
    return null;
  }
  const getAddressByLatLon = async (lat, lng) => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${
          import.meta.env.VITE_GEO_API_KEY
        }`,
      );
      dispatch(setAddress(result?.data?.results[0].formatted));
    } catch (error) {
      console.log(error);
    }
  };
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      dispatch(setLocation({ lat: latitude, lon: longitude }));
      getAddressByLatLon(latitude, longitude);
    });
  };

  const getLatLonByAddress = async () => {
    try {
      const result =
        await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          addressinput,
        )}&apiKey=${import.meta.env.VITE_GEO_API_KEY}
`);
      const { lat, lon } = result.data.features[0].properties;
      dispatch(setLocation({ lat, lon }));
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/place-order`,
        {
          paymentMethod: paymentType,
          deliveryAddress: {
            text: addressinput,
            latitude: location.lat,
            longitude: location.lon,
          },
          totalAmount: amountWithDelieveryFee,
          cartItems,
        },
        { withCredentials: true },
      );

      // COD → directly done
      if (paymentType === "cod") {
        dispatch(addMyOrder(result.data));
        navigate("/order-placed");
        return;
      }

      // ONLINE PAYMENT
      setPaypalOrderId(result.data.paypalOrderId);
      setBackendOrderId(result.data.orderId);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setAddressinput(address);
  }, [address]);
  return (
    <>
      <div className="h-full min-h-screen w-full bg-primary-dull-bg flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded shadow-2xl px-3 py-2">
          <h1 className="text-lg font-semibold text-primary  py-5">CheckOut</h1>
          <div className="w-full">
            <p className="text-md flex items-center gap-1 font-semibold">
              <IoLocationOutline size={20} className="text-primary" /> Delivery
              Location
            </p>
          </div>
          <div className="flex w-full mt-3 gap-1">
            <input
              className="outline-none px-2 py-1 border border-gray-300 rounded flex-2 cursor-pointer"
              placeholder="Enter Delivery Location"
              value={addressinput}
              onChange={(e) => setAddressinput(e.target.value)}
            />
            <button
              className="bg-primary text-white px-2 py-1 rounded cursor-pointer"
              onClick={getLatLonByAddress}
            >
              <IoIosSearch size={20} />
            </button>
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer "
              onClick={getCurrentLocation}
            >
              <FaLocationCrosshairs />
            </button>
          </div>
          <div className="rounded-xl border overflow-hidden mt-4">
            <div className="h-64 w-full flex items-center justify-center">
              <MapContainer
                className={"w-full h-full"}
                center={[location?.lat, location?.lon]}
                zoom={16}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                <Marker
                  position={[location?.lat, location?.lon]}
                  icon={new L.Icon({
    iconUrl: "/marker.png",       // directly from public folder
    iconSize: [34, 41],           
    iconAnchor: [17, 41],         // point of the icon that corresponds to marker location
    popupAnchor: [1, -34],        // point from which popups open
    
  })}
                  draggable
                  eventHandlers={{ dragend: onDragEnd }}
                ></Marker>
              </MapContainer>
            </div>
          </div>

          <div className="w-full mt-3">
            <p className="text-md flex items-center gap-1 font-semibold">
              Payment Option
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full mt-3">
            <div
              className={`shadow-xl ${
                paymentType === "cod"
                  ? `border border-green-600 bg-green-100`
                  : `border border-gray-200`
              } flex items-center px-3 py-1 rounded-2xl gap-3 cursor-pointer `}
              onClick={() => setPaymentType("cod")}
            >
              <div className="bg-green-300 rounded-full p-2 flex items-center justify-center h-10 w-10">
                <MdDeliveryDining size={20} className="text-green-800" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-md font-semibold">Cash On Delivery</p>
                <p className="text-sm text-gray-500/70 ">
                  Pay when we deliver it.
                </p>
              </div>
            </div>

            <div
              className={`shadow-xl ${
                paymentType === "online"
                  ? `border border-purple-600 bg-purple-200`
                  : `border border-gray-200`
              } flex items-center px-3 py-1 rounded-2xl gap-3 cursor-pointer `}
              onClick={() => setPaymentType("online")}
            >
              <div className="bg-purple-300 rounded-full p-2 flex items-center justify-center h-10 w-10">
                <IoIosPhonePortrait size={20} className="text-purple-700" />
              </div>
              <div className="bg-blue-200 rounded-full p-2 flex items-center justify-center h-10 w-10">
                <FaCreditCard size={20} className="text-blue-700" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-md font-semibold">
                  UPI / Debit / Credit Card
                </p>
                <p className="text-sm text-gray-500/70">Pay Securely Online</p>
              </div>
            </div>
          </div>

          <div className="w-full mt-3">
            <p className="text-md flex items-center gap-1 font-semibold">
              Order Details
            </p>
            <div className="flex flex-col w-full justify-center mt-5 border rounded-xl border-gray-200 shadow-xl py-3 gap-2">
              {cartItems.map((item, idx) => (
                <div className="w-full flex items-center justify-between px-4">
                  <p className="tex-md">
                    <b>{item.name}</b> * {item.quantity}
                  </p>
                  <div>
                    <p>
                      <b>&#8377;{item.price * item.quantity}</b>
                    </p>
                  </div>
                </div>
              ))}
              <hr className="w-full flex border border-gray-200" />
              <div className="flex px-5 gap-2">
                <p className="font-semibold">Subtotal: </p>
                <p>&#8377;{totalAmount}</p>
              </div>
              <div className="flex px-5 gap-2">
                <p className="font-semibold">Delivery Fee: </p>

                {deliveryFee > 0 ? <p>&#8377;{deliveryFee}</p> : "free"}
              </div>

              <div className="flex items-center px-5 gap-2">
                <p className="font-semibold text-lg text-primary">
                  Total Amount:{" "}
                </p>
                <p>&#8377;{amountWithDelieveryFee}</p>
              </div>
            </div>
          </div>
          <button
            className="w-full bg-primary text-white text-md flex items-center justify-center py-3 mt-5 rounded-xl cursor-pointer "
            onClick={handlePlaceOrder}
          >
            {paymentType === "cod" ? `Place Order` : `Pay & Place Order`}
          </button>
          {paymentType === "online" && paypalOrderId && backendOrderId && (
            <div className="mt-4">
              <PayPalButtons
                createOrder={() => paypalOrderId}
                onApprove={async () => {
                  try {
                    const result = await axios.post(
                      `${serverUrl}/api/order/confirm-paypal-payment`,
                      { paypalOrderId, orderId: backendOrderId },
                      { withCredentials: true },
                    );
                    dispatch(addMyOrder(result.data.order));
                    navigate("/order-placed");
                  } catch (err) {
                    console.error("PayPal Payment Error:", err);
                  }
                }}
                onError={(err) => console.error("PayPal Error:", err)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckOutPage;
