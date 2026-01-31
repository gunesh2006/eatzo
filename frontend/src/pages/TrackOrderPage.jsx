import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import DeliveryBoyTracking from "../components/deliveryBoyTracking";
import { useSelector } from "react-redux";
const TrackOrderPage = () => {
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState();
  console.log(currentOrder);
  const handleGetOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-order-by-id/${orderId}`,
        { withCredentials: true },
      );
      setCurrentOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const { socket } = useSelector((state) => state.user);

  const [liveLocations, setLiveLocations] = useState({});
  useEffect(() => {
    socket.on(
      "updateDeliveryLocation",
      ({ deliveryBoyId, latitude, longitude }) => {
        setLiveLocations((prev) => ({
          ...prev,
          [deliveryBoyId]: { lat: latitude, lon: longitude },
        }));
      },
    );
  }, [socket]);

  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-primary-dull-bg">
      <h1 className="text-lg font-semibold mt-5">Track Order</h1>

      {currentOrder?.shopOrders?.map((shopOrder, index) => (
        <>
          <div className="max-w-xl w-full p-4 flex flex-col bg-white rounded mt-4 shadow-xl">
            <p className="text-lg font-semibold text-primary">
              {shopOrder?.shop?.name}
            </p>
            <p className="text-md ">
              {shopOrder?.shopOrderItems?.map((i) => i.name).join(",")}
            </p>
            <p>
              <span className="font-semibold">Subtotal:</span> ₹
              {shopOrder?.subtotal}
            </p>
            <p>
              <span className="font-semibold">Delivery Address: </span>
              {currentOrder?.deliveryAddress?.text}
            </p>
          </div>
          {shopOrder.status != "delivered" ? (
            <div className="max-w-xl w-full p-4 flex flex-col bg-white rounded mt-4 shadow-xl">
              <h2 className="text-lg font-semibold text-primary">
                Delivery Partner details:
              </h2>
              {shopOrder.assignedDeliveryBoy ? (
                <div>
                  <p className="font-semibold">
                    🧑🏻‍🦱 {shopOrder.assignedDeliveryBoy.fullName}
                  </p>
                  <p className="font-semibold">
                    📞 {shopOrder.assignedDeliveryBoy.mobile}
                  </p>
                </div>
              ) : (
                <p>Delivery Boy is not assigned yet.</p>
              )}

              {shopOrder.assignedDeliveryBoy && (
                <DeliveryBoyTracking
                  data={{
                    deliveryBoyLocation: liveLocations[
                      shopOrder.assignedDeliveryBoy._id
                    ] || {
                      lat: shopOrder.assignedDeliveryBoy.location
                        .coordinates[1],
                      lon: shopOrder.assignedDeliveryBoy.location
                        .coordinates[0],
                    },
                    customerLocation: {
                      lat: currentOrder.deliveryAddress.latitude,
                      lon: currentOrder.deliveryAddress.longitude,
                    },
                  }}
                />
              )}
            </div>
          ) : (
            <div className="max-w-xl w-full p-4 flex flex-col bg-white rounded mt-4 shadow-xl">
              <p className="text-green-600 font-semibold text-lg">
                Order is Delivered. Thanks for choosing Eatzo
              </p>
            </div>
          )}
        </>
      ))}
    </div>
  );
};

export default TrackOrderPage;
