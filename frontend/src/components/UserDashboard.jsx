import React, { useEffect } from "react";
import axios from "axios";
import { IoMdSearch } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";
import { MdOutlineShoppingBag } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import { IoLocationSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import toast from "react-hot-toast";
import { setSearchQuery, setUserData } from "../redux/userSlice";
import { BannerImg, categories } from "../assets/data";
import CategoryCard from "./CategoryCard";
import ShopCard from "./ShopCard";
import FoodCard from "./FoodCard";
import { useNavigate } from "react-router-dom";
const UserDashboard = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [navSearch, setNavSearch] = useState({});

  const navigate = useNavigate();
  const { userData, city, shopInMyCity, allItems, cartItems } = useSelector(
    (state) => state.user,
  );
  const dispatch = useDispatch();
  console.log(userData.fullName);

  const [updatedItemsList, setUpdatedItemsList] = useState([]);

  const handleFilterByCategory = (category) => {
    console.log("Clicked category:", category);
    console.log(
      "All items categories:",
      allItems.map((i) => i.category),
    );
    if (category == "Others") {
      setUpdatedItemsList(allItems);
    } else {
      const filteredList = allItems.filter((i) => i.category === category);
      setUpdatedItemsList(filteredList);
    }
  };

  useEffect(() => {
    if (navSearch.length > 0) {
      navigate("/all-products");
    }
  }, [navSearch]);

  useEffect(() => {
    setUpdatedItemsList(allItems);
  }, [allItems]);
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
  return (
    <>
      <div className="w-full h-20 flex flex-row items-center justify-around">
        <div className="max-w-2xl bg-white rounded-4xl h-15 items-center justify-center px-5 py-3 flex flex-row gap-4 sm:gap-5 shadow-md">
          <h1 className="text-3xl font-semibold text-primary">Eatzo</h1>
          <p className="text-2xl text-primary-dull">|</p>
          <div className="hidden sm:block">
            <div className="flex flex-row gap-1">
              <IoLocationSharp size={22} className="text-primary" />
              <p className="text-md text-primary font-semibold">{city}</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="max-w-md bg-primary-dull-bg h-10 rounded-3xl flex flex-row items-center justify-center">
              <input
                className="w-[90%] h-full outline-none px-3 text-primary/80 hidden sm:block"
                placeholder="search something..."
                onChange={(e) => setNavSearch(e.target.value)}
              />
              <div className="bg-primary h-full flex items-center justify-center p-3 rounded-4xl text-white cursor-pointer">
                <IoMdSearch size={20} fontWeight={800} />
              </div>
            </div>
          </div>
          <div className="cursor-pointer relative h-full flex items-center justify-center">
            <div className="h-2 flex items-center justify-center w-2 p-2.5 text-sm rounded-full bg-primary text-white absolute left-3 bottom-5">
              {cartItems.length || 0}
            </div>
            <MdOutlineShoppingCart
              size={22}
              className="text-primary"
              onClick={() => navigate("/cart")}
            />
          </div>
          <div
            className="cursor-pointer"
            onClick={() => navigate("/my-orders")}
          >
            <MdOutlineShoppingBag size={22} className="text-primary" />
          </div>
          <div className="cursor-pointer h-full flex items-center justify-center relative">
            <IoPersonSharp
              size={25}
              className="text-white bg-primary p-1 rounded-full"
              onClick={() => setShowInfo((showInfo) => !showInfo)}
            />
            {showInfo && (
              <div className="absolute p-3 bg-white flex flex-col top-13 right-0 rounded z-2">
                <div className="flex flex-row gap-1 mb-2">
                  <p>
                    <FaRegUser size={22} className="text-primary" />
                  </p>
                  <p>{userData?.fullName}</p>
                </div>
                <hr className="text-gray-200" />
                <div className="flex flex-row gap-1 mt-2 mb-2 sm:hidden">
                  <IoLocationOutline size={22} className="text-primary" />
                  <p>{city}</p>
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
      <div className="w-full flex flex-col px-3 sm:px-5 md:px-10 items-center justify-center mt-15">
        <div className="w-full max-w-6xl h-150 sm:h-100 bg-primary flex shadow-2xl rounded-2xl overflow-hidden relative">
          <img
            src={BannerImg.bannerLg}
            className="w-full object-cover hidden sm:flex "
          />
          <img
            src={BannerImg.bannerSm}
            className="w-full object-cover sm:hidden"
          />
          {/* Text Content */}
          <div className="absolute inset-0 flex items-start sm:items-center justify-center sm:justify-end">
            <div className="px-6 sm:px-12 max-w-md flex flex-col text-center sm:text-left py-5">
              <h1 className="text-3xl sm:text-5xl font-bold text-white drop-shadow-md leading-tight">
                Hunger called. <br /> We answered.
              </h1>

              <p className="mt-3 text-md sm:text-lg text-white/90">
                Fresh, hot meals delivered straight to your doorstep — fast,
                fresh, and fuss-free.
              </p>
              <button
                className="p-3 bg-white text-primary font-semibold cursor-pointer rounded-xl mt-90 sm:mt-3 transform transition duration-200 hover:bg-primary hover:text-white border hover:border-white"
                onClick={() => navigate("/all-products")}
              >
                Explore Now
              </button>
            </div>
          </div>
        </div>

        {/* category */}
        <div className="w-full max-w-6xl  flex flex-col mt-15">
          <h1 className="text-3xl text-primary font-semibold leading-tight">
            Categories
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mt-10 px-10">
            {categories.map((category, idx) => (
              <CategoryCard
                data={category}
                key={idx}
                onclick={() => handleFilterByCategory(category.category)}
              />
            ))}
          </div>
        </div>

        {/* shops */}
        <div className="w-full max-w-6xl  flex flex-col mt-15">
          <h1 className="text-3xl text-primary font-semibold leading-tight">
            Best Shops In <b>{city}</b>
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mt-10 px-10">
            {shopInMyCity?.map((shop, idx) => (
              <ShopCard
                data={shop}
                key={idx}
                onClick={() => navigate(`/shop/${shop._id}`)}
              />
            ))}
          </div>
        </div>

        {/* items */}
        <div className="w-full max-w-6xl  flex flex-col mt-15">
          <h1 className="text-3xl text-primary font-semibold leading-tight">
            All Items
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mt-10 px-10">
            {updatedItemsList?.map((item, idx) => (
              <FoodCard data={item} key={idx} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
