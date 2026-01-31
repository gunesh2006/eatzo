import React, { useState } from "react";
import { MdOutlineLocalPhone } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/userSlice";

const OwnerOrderCard = ({ data }) => {
  const [availableBoys, setAvailableBoys] = useState([]);
  const dispatch = useDispatch();
  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true }
      );
      dispatch(updateOrderStatus({ orderId, shopId, status }));
      setAvailableBoys(result?.data?.availableDeliveryBoys);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-xl px-5 flex flex-col justify-between bg-white rounded shadow-md mt-4">
      <div className="w-full py-2 flex flex-col  justify-between">
        <h1 className="font-bold text-lg">{data.user.fullName}</h1>
        <p className="flex gap-2 items-center text-gray-600">
          <MdOutlineEmail className="text-primary" />
          {data.user.email}
        </p>
        <p className="flex gap-2 items-center text-gray-600">
          <MdOutlineLocalPhone className="text-primary" />
          {data.user.mobile}
        </p>
      </div>
      <div>
        <p className="flex gap-2 items-center text-gray-600">
          <MdMyLocation className="text-primary" />
          {data.deliveryAddress.text}
        </p>
        <div className="flex gap-2 text-gray-600">
          <p>Lat: {data.deliveryAddress.latitude} ,</p>
          <p>Lon: {data.deliveryAddress.longitude}</p>
        </div>

        <div className="w-full flex flex-col sm:flex-row items-center gap-2">
          {data.shopOrders.shopOrderItems.map((shopOrderItem, idx) => (
            <div
              className="w-full max-h-48 max-w-40 flex flex-col bg-white border border-gray-200 mt-4 mb-3 px-2 py-2 rounded-xl overflow-hidden"
              key={idx}
            >
              <img
                src={shopOrderItem.item.image}
                className="w-full object-cover rounded-xl max-h-24"
              />
              <p className="text-md font-semibold">{shopOrderItem.name}</p>
              <p>
                ₹{shopOrderItem.price} * {shopOrderItem.quantity}
              </p>
            </div>
          ))}
        </div>

        <hr className="w-full border border-gray-200" />
        <div className="flex items-center justify-between mt-4 ">
          <p className="textsm text-red-400 font-semibold">
            {data.shopOrders.status}
          </p>
          <select
            className="outline-none border-primary border rounded px-2 py-1 cursor-pointer text-gray-600 "
            onChange={(e) => {
              handleUpdateStatus(
                data._id,
                data.shopOrders.shop._id,
                e.target.value
              );
            }}
          >
            <option value="pending">Change</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="out for delivery">Out for Delivery</option>
          </select>
        </div>

        {data.shopOrders.status == "out for delivery" && (
          <div className="flex flex-col px-2 py-3 bg-primary-dull-bg mt-4 rounded ">
            {data.shopOrders.assignedDeliveryBoy ? (
              <p className="text-md font-semibold">
                Assigned Delivery Partner:
              </p>
            ) : (
              <p className="text-md font-semibold">
                Available Delivery Partners:
              </p>
            )}
            {availableBoys?.length > 0 ? (
              availableBoys.map((b, idx) => (
                <div className="text-md text-gray-500">
                  {b.fullName}-{b.mobile}
                </div>
              ))
            ) : data.shopOrders.assignedDeliveryBoy ? (
              <div className="text-md text-gray-500">
                {data.shopOrders.assignedDeliveryBoy.fullName} -{" "}
                {data.shopOrders.assignedDeliveryBoy.mobile}
              </div>
            ) : (
              <div className="text-md text-gray-500">
                Waiting for Delivery Partners
              </div>
            )}
          </div>
        )}
        <p className="mt-3 mb-2">
          Total : <b>₹{data.shopOrders.subtotal}</b>
        </p>
      </div>
    </div>
  );
};

export default OwnerOrderCard;
