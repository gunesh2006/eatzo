import axios from "axios";
import React from "react";
import { FaLeaf } from "react-icons/fa";
import { GiChickenLeg } from "react-icons/gi";
import { GoPencil } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

const OwnerItemCard = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDeleteItem = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/item/delete-item/${data._id}`,
        { withCredentials: true }
      );
      dispatch(setMyShopData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col sm:flex-row gap-6 py-4 bg-white shadow-2xl rounded-lg mt-7 mb-1 transform transition duration-300 hover:scale-105">
      {/* Left Section */}
      <div className="flex w-full px-5 gap-5">
        {/* Image */}
        <div className="w-30 h-30 object-cover sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded">
          <img
            src={data.image}
            alt={data.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xl text-primary font-semibold truncate">
            {data.name}
          </p>

          <p className="text-md">
            <b>Category:</b> {data.category}
          </p>

          <p className="flex items-center gap-2 text-md">
            <b>Type:</b> {data.foodType}
            {data.foodType === "Veg" ? (
              <FaLeaf size={16} className="text-green-600" />
            ) : (
              <GiChickenLeg size={16} className="text-red-600" />
            )}
          </p>

          <p className="text-lg text-primary font-bold">&#8377; {data.price}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex sm:flex-col items-center justify-center gap-4 px-5">
        <button
          className="bg-primary w-10 h-10 flex items-center justify-center text-white rounded-full hover:opacity-90 transition"
          onClick={() => navigate(`/edit-item/${data._id}`)}
        >
          <GoPencil size={20} />
        </button>

        <button
          className="bg-primary w-10 h-10 flex items-center justify-center text-white rounded-full hover:bg-red-600 transition"
          onClick={handleDeleteItem}
        >
          <MdDeleteOutline size={20} />
        </button>
      </div>
    </div>
  );
};

export default OwnerItemCard;
