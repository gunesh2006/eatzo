import React from "react";
import axios from "axios";
import { IoReceiptOutline } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { BiLogOut } from "react-icons/bi";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { IoFastFoodOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import toast from "react-hot-toast";
import { setUserData } from "../redux/userSlice";
import { GoPencil } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import OwnerItemCard from "./OwnerItemCard";
const OwnerDashboard = () => {
  const [showInfo, setShowInfo] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner);
  console.log(myShopData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(userData?.fullName);
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

  console.log(myShopData?.items?.length);
  return (
    <>
      {/* navbar */}
      <div className="w-full h-20 flex flex-row items-center justify-around">
        <div className="max-w-2xl bg-white rounded-4xl h-15 items-center justify-center px-5 py-3 flex flex-row gap-4 sm:gap-5 shadow-md">
          <h1 className="text-3xl font-semibold text-primary">Eatzo</h1>
          <p className="text-2xl text-primary-dull">|</p>
          {myShopData && (
            <div
              className="flex flex-row items-center justify-center gap-2 p-2 bg-primary-dull-bg text-primary rounded-4xl cursor-pointer"
              onClick={() => navigate("/add-item")}
            >
              <IoMdAdd size={20} />
              <p className="hidden sm:flex">Add Food Item</p>
            </div>
          )}
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
      {/* main landing box */}
      {!myShopData && (
        <div className="flex items-center justify-center p-10">
          <div className="flex items-center justify-center bg-white rounded-2xl flex-col p-5 max-w-md shadow-md hover:shadow-lg cursor-pointer">
            <div className="flex items-center justify-center p-3 rounded-full bg-primary">
              <IoFastFoodOutline
                size={80}
                className="text-white"
                fontWeight={1000}
              />
            </div>

            <p className="text-primary text-md mt-4">
              From your kitchen to countless doorsteps — we make it happen.
              Create your shop and start growing your food business today.
            </p>
            <button
              className="bg-primary text-white px-4 py-2 text-md cursor-pointer mt-3 rounded-2xl hover:shadow-md"
              onClick={() => navigate("/create-edit-shop")}
            >
              Add Your Shop
            </button>
          </div>
        </div>
      )}
      {/* after data  */}
      {myShopData && (
        <div className="flex flex-col items-center justify-center px-5 sm:px-15 mt-10">
          <h1 className="text-3xl font-semibold">
            Welcome to <span className="text-primary">{myShopData.name}</span>
          </h1>
          <div className="max-w-2xl flex flex-col mt-10 rounded-2xl relative">
            <img
              src={myShopData.image}
              className="w-full object-cover rounded-t-2xl"
            />
            <div className="w-full flex flex-col gap-2 py-5 px-3 bg-white rounded-b-2xl shadow-xl ">
              <h1 className="text-2xl font-bold text-primary">
                {myShopData.name}
              </h1>
              <p>
                {myShopData.address}, {myShopData.city}, {myShopData.state}
              </p>
            </div>
            <div
              className="absolute right-3 top-2 bg-primary rounded-full flex items-center justify-center p-3 cursor-pointer"
              onClick={() => navigate("/create-edit-shop")}
            >
              <GoPencil size={20} color="white" />
            </div>
          </div>
        </div>
      )}
      {/* {add item} */}
      {myShopData?.items?.length === 0 && (
        <div className="flex items-center justify-center p-10 mt-5">
          <div className="flex items-center justify-center bg-white rounded-2xl flex-col p-5 max-w-md shadow-md hover:shadow-lg cursor-pointer">
            <div className="flex items-center justify-center p-3 rounded-full bg-primary">
              <IoFastFoodOutline
                size={80}
                className="text-white"
                fontWeight={1000}
              />
            </div>

            <p className="text-primary text-md mt-4">
              Good food deserves an audience, Add your first item and let the
              city taste your magic.
            </p>
            <button
              className="bg-primary text-white px-4 py-2 text-md cursor-pointer mt-3 rounded-2xl hover:shadow-md"
              onClick={() => navigate("/add-item")}
            >
              List Food Items
            </button>
          </div>
        </div>
      )}

      {myShopData?.items?.length > 0 && (
        <>
          <h1 className="text-center text-3xl text-primary font-semibold mt-8">
            Listed Items
          </h1>
          <div className="flex flex-col items-center justify-center px-5  ">
            <div className="flex flex-col w-full items-center justify-center gap-4 max-w-4xl">
              {myShopData.items.map((item, idx) => (
                <OwnerItemCard data={item} key={idx} />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OwnerDashboard;
