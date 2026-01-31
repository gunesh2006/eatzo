import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";
import { setMyOrders, updateRealtimeOrderStatus } from "../redux/userSlice";
const MyOrders = () => {
  const { userData, myOrders, socket } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.on("newOrder", (data) => {
      if (data?.shopOrders?.owner?._id == userData._id) {
        dispatch(setMyOrders([data, ...myOrders]));
      }
    });

    socket?.on("update-status", ({ orderId, shopId, status, userId }) => {
      if (userId == userData._id) {
        dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }));
      }
    });

    return () => {
      socket?.off("newOrder");
      socket?.off("update-status");
    };
  }, [socket]);

  return (
    <div className="w-full min-h-screen bg-primary-dull-bg flex flex-col">
      <div className="flex h-auto items-center justify-center gap-2 mt-8">
        <IoIosArrowRoundBack
          size={23}
          className="cursor-pointer text-primary"
          onClick={() => navigate("/")}
        />
        <p className="font-semibold text-md">My Orders</p>
      </div>

      {myOrders.length > 0 ? (
        <div className="space-y-6 flex flex-col items-center justify-center">
          {myOrders.map((order, idx) =>
            userData.role === "User" ? (
              <UserOrderCard data={order} key={idx} />
            ) : userData.role === "Owner" ? (
              <OwnerOrderCard data={order} key={idx} />
            ) : null,
          )}
        </div>
      ) : (
        <p className="text-primary text-md text-center mt-5">
          Missing Delicious Food,and still not ordering?
        </p>
      )}
    </div>
  );
};

export default MyOrders;
