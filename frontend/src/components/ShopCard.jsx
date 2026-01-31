import React from "react";

const ShopCard = ({ data, onClick }) => {
  return (
    <div
      className="flex h-50 w-flex max-w-xs sm:max-w-lg bg-white rounded-xl shadow-2xl transform transition duration-200 hover:scale-105 overflow-hidden relative cursor-pointer"
      onClick={onClick}
    >
      <img src={data.image} className="w-full object-cover " />

      <div className="w-full bg-black/20 backdrop-blur-sm text-white absolute bottom-0 flex items-center justify-center py-2">
        <h3>{data.name}</h3>
      </div>
    </div>
  );
};

export default ShopCard;
