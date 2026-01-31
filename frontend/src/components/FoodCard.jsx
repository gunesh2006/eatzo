import React, { useState } from "react";
import { FaLeaf } from "react-icons/fa";
import { GiChickenLeg } from "react-icons/gi";
import { RiStarSFill } from "react-icons/ri";
import { RiStarSLine } from "react-icons/ri";
import { MdPeopleAlt } from "react-icons/md";
import { RiSubtractLine } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/userSlice";
import { IoCartOutline } from "react-icons/io5";
import toast from "react-hot-toast";
const FoodCard = ({ data }) => {
  const [quantity, setQuantity] = useState(0);

  const dispatch = useDispatch();
  const starRating = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <RiStarSFill className="text-primary text-lg" />
        ) : (
          <RiStarSLine className="text-primary text-lg" />
        )
      );
    }
    return stars;
  };
  const addQuantity = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
  };
  const subQuantity = () => {
    if (quantity > 0) {
      const newQty = quantity - 1;
      setQuantity(newQty);
    }
  };
  return (
    <div
      className="flex flex-col max-w-md h-auto  shadow-primary-dull shadow-[0_20px_50px_rgba(0,0,0,0.25)]
  border border-white/20
  transform transition-all duration-300
  hover:-translate-y-2
  hover:shadow-[0_35px_80px_rgba(0,0,0,0.35)] rounded-2xl  cursor-pointer"
    >
      <div className="w-full h-50 rounded-t-xl overflow-hidden relative min-h-30">
        <img
          src={data.image}
          className="w-full h-full object-cover sm:object-cover transform transition duration-200 hover:scale-105"
        />
        <div
          className={`absolute top-2 right-2 w-8 h-8 p-2 rounded-full flex items-center justify-center z-3 ${
            data.foodType === "Veg" ? `bg-green-600` : `bg-red-600`
          }`}
        >
          {data.foodType === "Veg" ? (
            <FaLeaf size={20} color="white" />
          ) : (
            <GiChickenLeg size={20} color="white" />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start justify-center px-5 py-5 rounded-xl overflow-hidden">
        <p className="text-lg font-semibold truncate">{data.name}</p>
        <div className="w-full flex justify-between">
          <div className="flex">{starRating(data.rating?.average)}</div>
          <span className="flex gap-2 items-center justify-center">
            {data.rating?.noOfRating}
            <MdPeopleAlt className="text-md" />
          </span>
        </div>
        <div className="w-full flex justify-between items-start">
          <p className="text-md font-bold">&#8377; {data.price}</p>
          <div className="flex gap-2 bg-primary-dull  rounded-full ">
            <button
              className="cursor-pointer hover:bg-primary hover:text-white tranform transition duration-200 w-full rounded-l-full p-1"
              onClick={subQuantity}
            >
              <RiSubtractLine />
            </button>
            <p>{quantity}</p>
            <button
              className="cursor-pointer hover:bg-primary hover:text-white tranform transition duration-200 w-full rounded-r-full p-1"
              onClick={addQuantity}
            >
              <IoMdAdd />
            </button>
          </div>
        </div>
      </div>
      <div
        className="w-full bg-primary text-white text-md cursor-pointer flex items-center justify-center px-3 py-2 rounded-b-2xl hover:bg-primary/90 gap-2"
        onClick={() => {
          if (quantity == 0) {
            toast.error("Add quantity!");
          } else {
            dispatch(
              addToCart({
                id: data._id,
                name: data.name,
                price: data.price,
                image: data.image,
                shop: data.shop,
                quantity: quantity,
                foodType: data.foodType,
              })
            );
            toast.success("added to cart");
          }
        }}
      >
        <IoCartOutline />
        Add to Cart
      </div>
    </div>
  );
};

export default FoodCard;
