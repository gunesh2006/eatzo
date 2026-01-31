import React from "react";
import { serverUrl } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { IoLocationOutline } from "react-icons/io5";
import { BiSolidFoodMenu } from "react-icons/bi";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useEffect } from "react";
import { ImOffice } from "react-icons/im";
import { useState } from "react";
import FoodCard from "../components/FoodCard";
const Shop = () => {
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState([]);
  const navigate = useNavigate();
  console.log(shop);
  const handleShop = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/item/get-items-by-shop/${shopId}`,
        { withCredentials: true },
      );

      setShop(result.data.shop);
      setItems(result.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleShop();
  }, [shopId]);
  return (
    <div className="min-h-screen w-full bg-primary-dull-bg flex flex-col">
      {shop && (
        <>
          <div className="w-full bg-white h-100">
            <img src={shop.image} className="w-full h-full object-cover " />
            <div className="absolute w-full h-100 inset-0 bg-linear-to-b from-black/70 to-black/30 flex flex-col justify-center items-center text-center px-4">
              <div
                className="absolute left-3 top-3 flex items-center gap-2 rounded bg-black/30 text-white px-3 py-1 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <FaLongArrowAltLeft size={18} />
                <p>Back</p>
              </div>
              <p className="text-5xl font-bold text-white flex items-center gap-3">
                <ImOffice size={30} /> {shop.name}
              </p>
              <p className="text-sm font-semi-bold text-white flex items-center gap-1">
                {shop.address}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center mt-4">
            <p className="text-sm font-semibold flex gap-1 items-center">
              <IoLocationOutline size={16} className="text-primary" />{" "}
              {shop.city}
            </p>
          </div>

          <div className="flex items-center justify-center mt-10">
            <p className="text-xl font-semibold flex gap-1 items-center">
              <BiSolidFoodMenu size={20} className="text-primary" /> Our Menu
            </p>
          </div>

          <div className="w-full grid grid-cols-1 gap-5 px-5 sm:px-10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mt-5">
            {items.map((item, idx) => (
              <FoodCard data={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Shop;
