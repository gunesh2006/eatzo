import React, { useEffect } from "react";
import axios from "axios";
import { IoReceiptOutline } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking";

const DeliveryBoyDashboard = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [otp, setOtp] = useState("");

  const [showOtpBox, setShowOtpBox] = useState(false);
  const [availableAssignments, setAvailableAssignments] = useState(null);
  const { userData, socket } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      return toast.success("logged out successfully");
    } catch (error) {
      return res.status(500).json({ message: "not logged out some error" });
    }
  };

  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);

  useEffect(() => {
    if (!socket || userData.role !== "DeliveryBoy") {
      return;
    }
    let watchId;
    if (navigator.geolocation) {
      (((watchId = navigator.geolocation.watchPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setDeliveryBoyLocation({
          lat: latitude,
          lon: longitude,
        });
        socket.emit("updateLocation", {
          latitude,
          longitude,
          userId: userData._id,
        });
      })),
      (error) => {
        console.log(error);
      }),
        {
          enableHighAccuracy: true, // use gps to get current position
        });
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [socket, userData]);

  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, {
        withCredentials: true,
      });
      setAvailableAssignments(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentOrer = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-current-order`,
        {
          withCredentials: true,
        },
      );
      setCurrentOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        {
          withCredentials: true,
        },
      );
      console.log(result.data);
      await getCurrentOrer();
    } catch (error) {
      console.log(error);
    }
  };

  const sendOtp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/send-delivery-otp`,
        { orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id },
        {
          withCredentials: true,
        },
        setShowOtpBox(true),
      );
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyOtp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp,
        },
        {
          withCredentials: true,
        },
      );
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket?.on("newAssignment", (data) => {
      if (data.sentTo == userData._id) {
        setAvailableAssignments((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("newAssignment");
    };
  }, [socket]);
  useEffect(() => {
    getAssignments();
    getCurrentOrer();
  }, [userData]);
  return (
    <>
      {/* navbar */}
      <div className="w-full h-20 flex flex-row items-center justify-around">
        <div className="max-w-2xl bg-white rounded-4xl h-15 items-center justify-center px-5 py-3 flex flex-row gap-4 sm:gap-5 shadow-md">
          <h1 className="text-3xl font-semibold text-primary">Eatzo</h1>

          <div className="relative">
            <div
              className="flex flex-row items-center justify-center gap-2 p-2 bg-primary-dull-bg text-primary rounded-4xl cursor-pointer"
              onClick={() => navigate("/my-orders")}
            >
              <IoReceiptOutline size={20} />
              <p className="hidden sm:flex">Orders</p>
            </div>
          </div>
          <div className="cursor-pointer h-full flex items-center justify-center relative">
            <IoPersonSharp
              size={25}
              className="text-white bg-primary p-1 rounded-full"
              onClick={() => setShowInfo((showInfo) => !showInfo)}
            />
            {showInfo && (
              <div className="absolute p-3 bg-white flex flex-col top-13 right-0 rounded z-3">
                <div className="flex flex-row gap-1 mb-2">
                  <p>
                    <FaRegUser size={22} className="text-primary" />
                  </p>
                  <p>{userData?.fullName}</p>
                </div>

                <hr className="text-gray-200" />
                <div
                  className="flex flex-row gap-1 mt-2"
                  onClick={handleLogout}
                >
                  <BiLogOut size={22} className="text-primary" /> <p>Logout</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full min-h-screen px-5 flex flex-col items-center ">
        <div className="bg-white shadow rounded items-center justify-center flex flex-col px-3 py-4 w-full max-w-lg mt-5 h-auto">
          <p className="text-xl font-bold text-primary text-center">
            Welcome! {userData.fullName}
          </p>
          <div className="w-full flex items-center justify-center gap-2 text-md text-primary">
            <p>
              Latitude: <b>{deliveryBoyLocation?.lat}</b>
            </p>
            <p>
              Longitude: <b>{deliveryBoyLocation?.lon}</b>
            </p>
          </div>
        </div>
        {!currentOrder && (
          <div className="bg-white shadow rounded items-start justify-center flex flex-col px-3 py-4 w-full max-w-lg mt-5 h-auto">
            <p className="text-lg font-bold  text-center">Available Orders</p>

            {availableAssignments && availableAssignments.length > 0 ? (
              availableAssignments.map((i, idx) => (
                <div className="flex  items-center justify-between ">
                  <div
                    key={idx}
                    className="px-2 py-2  border w-full mt-2 mb-2 rounded"
                  >
                    <p className="font-semibold text-lg text-primary">
                      {i.shopName}
                    </p>
                    <p className="text-md text-gray-700">
                      <b>Delivery Address: </b>
                      {i.deliveryAddress.text}
                    </p>
                    <p>
                      <b>{i.items.length}</b> items | ₹{i.subtotal}
                    </p>
                    <div className="w-full flex items-center justify-center">
                      <button
                        className="bg-green-100 px-2 py-1 rounded-full flex items-center justify-center cursor-pointer text-black border border-green-600 gap-2"
                        onClick={() => acceptOrder(i.assignmentId)}
                      >
                        <FaCheck /> Accept
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">No Available Orders</p>
            )}
          </div>
        )}

        {currentOrder && (
          <div className="bg-white shadow rounded items-start justify-center flex flex-col px-3 py-4 w-full max-w-lg mt-5 h-auto">
            <h2 className="text-lg font-semibold">📦Current Order</h2>
            <div>
              <p>{currentOrder?.shopOrder.shop.name}</p>
              <p className="text-md text-gray-600">
                {currentOrder?.deliveryAddress.text}
              </p>
              <p>
                {currentOrder?.shopOrder.shopOrderItems.length} items | ₹
                <b>{currentOrder.shopOrder.subtotal}</b>
              </p>
            </div>
          </div>
        )}

        {currentOrder && (
          <div className="bg-white shadow rounded items-start justify-center flex flex-col px-3 py-4 w-full max-w-lg mt-5 h-auto">
            <DeliveryBoyTracking
              data={{
                deliveryBoyLocation: deliveryBoyLocation || {
                  lat: userData.location.coordinates[1],
                  lon: userData.location.coordinates[0],
                },
                customerLocation: {
                  lat: currentOrder.deliveryAddress.latitude,
                  lon: currentOrder.deliveryAddress.longitude,
                },
              }}
            />
            {!showOtpBox ? (
              <button
                className="w-full flex items-center justify-center py-2 textmd text-white bg-primary cursor-pointer rounded mt-4"
                onClick={sendOtp}
              >
                Mark as delivered
              </button>
            ) : (
              <div className="w-full mt-4">
                <p>
                  Enter OTP send to <b>{currentOrder.user.fullName}</b>
                </p>
                <input
                  className="w-full px-2 py-1 outline-none border border-gray-300 mt-1 rounded"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  className="w-full flex items-center justify-center py-2 textmd text-white bg-primary cursor-pointer rounded mt-4"
                  onClick={verifyOtp}
                >
                  Verify OTP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default DeliveryBoyDashboard;
