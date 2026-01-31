import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import toast from "react-hot-toast";
const UserOrderCard = ({ data }) => {
  console.log(data);
  const [selectedRating, setSelectedRating] = useState({});
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleRating = async (itemId, rating) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/item/rating`,
        { itemId, rating },
        { withCredentials: true },
      );

      setSelectedRating((prev) => ({
        ...prev,
        [itemId]: rating,
      }));

      toast.success("Thanks for Rating!");
    } catch (error) {
      console.log(error);
    }
  };
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-xl px-5 flex flex-col justify-between bg-white rounded shadow-md mt-4">
      <div className="w-full py-2 flex items-center justify-between">
        <div>
          <p>Order #{data._id}</p>
          <p className="text-gray-500 text-sm">
            Date: {formatDate(data.createdAt)}
          </p>
        </div>

        <div>
          <p>{data.paymentMethod.toUpperCase()}</p>
          <p className="text-blue-400 text-sm font-semibold">
            {data.shopOrders?.[0].status}
          </p>
        </div>
      </div>
      <hr className="border border-gray-200 w-full" />
      {data.shopOrders.map((shopOrder, idx) => (
        <div
          className="w-full py-4 bg-primary-dull-bg mt-5 flex flex-col gap-3 px-4"
          key={idx}
        >
          <p className="text-lg font-semibold">{shopOrder.shop.name}</p>
          <div className="w-full flex flex-col sm:flex-row items-center gap-2">
            {shopOrder.shopOrderItems.map((shopOrderItem, idx) => (
              <div
                className="w-full max-h-48 max-w-40 flex flex-col bg-white  px-2 py-2 rounded-xl overflow-hidden"
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

                <div className="flex space-x-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      className={`text-lg cursor-pointer ${selectedRating[shopOrderItem.item._id] >= star ? "text-yellow-400" : "text-gray-400"}`}
                      onClick={() => handleRating(shopOrderItem.item._id, star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <hr className="border border-gray-400 w-full" />
          <div className="flex items-center justify-between">
            <p>
              <b>Subtotal: </b>₹{shopOrder.subtotal}
            </p>
            <p className="text-sm font-semibold text-blue-400"></p>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between mt-5 mb-4">
        <p className="my-2">
          Total: <b>₹{data.totalAmount}</b>
        </p>
        <button
          className="text-sm bg-primary px-3 py-1 cursor-pointer text-white rounded"
          onClick={() => navigate(`/track-order/${data._id}`)}
        >
          Track Order
        </button>
      </div>
    </div>
  );
};

export default UserOrderCard;
