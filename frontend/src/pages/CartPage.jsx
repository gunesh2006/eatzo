import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartCard from "../components/CartCard";

const CartPage = () => {
  const { cartItems, totalAmount } = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <div className="h-full min-h-screen w-full bg-primary-dull-bg flex flex-col">
      <div className="flex h-auto items-center justify-center gap-2 mt-8">
        <IoIosArrowRoundBack
          size={23}
          className="cursor-pointer"
          onClick={() => navigate("/")}
        />
        <p className="font-semibold text-md">Cart Items</p>
      </div>
      <div className="flex flex-col items-center w-full justify-center mt-8 px-5 gap-10">
        {cartItems.length ? (
          cartItems.map((item, idx) => <CartCard item={item} key={idx} />)
        ) : (
          <p className="text-center text-md text-primary mt-4">
            Cart Is Empty , Add Items to Place Order
          </p>
        )}
        {cartItems.length > 0 && (
          <div className="max-w-xl w-full flex flex-col gap-3 sm:flex-row items-center justify-between px-5 bg-white shadow-2xl rounded-xl py-4">
            <p>
              Total Bill: <b>&#8377;{totalAmount}</b>
            </p>
            <button
              className="bg-primary text-white px-3 py-2 rounded cursor-pointer"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
