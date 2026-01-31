import React from "react";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrderPlaced = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center bg-primary-dull-bg h-full min-h-screen px-5">
      <div className="w-22 h-22 rounded-full flex items-center justify-center p-2 bg-green-600 text-white">
        <FaCheck size={40} />
      </div>
      <h1 className="text-2xl font-semibold mt-3">Order Placed !</h1>

      <p className="text-gray-500 text-md max-w-lg text-center mt-2">
        Thank you for your purchase. Your order is being prepared. You can track
        your order status in "My Orders" tab
      </p>
      <button
        className="max-w-sm px-3 py-2 bg-primary text-white rounded cursor-pointer mt-4"
        onClick={() => navigate("/my-orders")}
      >
        Back to My Orders
      </button>
    </div>
  );
};

export default OrderPlaced;
