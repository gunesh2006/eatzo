import React from "react";
import { RiSubtractFill } from "react-icons/ri";
import { MdAdd } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import { useDispatch } from "react-redux";
import { removeItem, updateQuantity } from "../redux/userSlice";
const CartCard = ({ item }) => {
  const dispatch = useDispatch();
  const addQuantity = (id, CurrQuantity) => {
    dispatch(updateQuantity({ id, quantity: CurrQuantity + 1 }));
  };
  const subQuantity = (id, CurrQuantity) => {
    if (CurrQuantity > 1) {
      dispatch(updateQuantity({ id, quantity: CurrQuantity - 1 }));
    }
  };
  const handleDelete = (id) => {
    dispatch(removeItem(id));
  };
  return (
    <div className="flex flex-col sm:flex-row w-full max-w-xl bg-white shadow-2xl rounded-xl justify-between tranform transition duration-200 hover:-translate-y-2">
      <div className="flex gap-2">
        <div className="w-30 h-30 py-2 overflow-hidden rounded-xl shrink-0">
          <img
            src={item.image}
            className="w-full h-full px-3 py-2 object-cover"
          />
        </div>
        <div className="flex flex-col items-start  justify-center">
          <p className="text-lg text-primary font-semibold">{item.name}</p>
          <p className="text-sm text-gray-700">
            &#8377;{item.price} * {item.quantity}
          </p>
          <p className="font-semibold text-md">
            &#8377;{item.price * item.quantity}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 px-10 justify-center mb-3">
        <button className="bg-gray-300 rounded-full p-1">
          <RiSubtractFill
            size={20}
            className="cursor-pointer"
            onClick={() => subQuantity(item.id, item.quantity)}
          />
        </button>
        <p>{item.quantity}</p>
        <button
          className="bg-gray-300 rounded-full p-1"
          onClick={() => addQuantity(item.id, item.quantity)}
        >
          <MdAdd size={19} className="cursor-pointer" />
        </button>
        <button
          className="bg-red-300 rounded-full p-1.5"
          onClick={() => handleDelete(item.id)}
        >
          <GoTrash size={19} className="cursor-pointer text-red-700" />
        </button>
      </div>
    </div>
  );
};

export default CartCard;
