import React from "react";

const CategoryCard = ({ data, onclick }) => {
  return (
    <div
      className="flex h-50 w-flex max-w-xs sm:max-w-lg bg-white rounded-xl shadow-2xl transform transition duration-200 hover:scale-105 overflow-hidden relative cursor-pointer"
      onClick={onclick}
    >
      <img
        src={data.image}
        className="w-full object-cover transform transition duration-200 hover:scale-105 "
      />

      <div className="w-full bg-black/20 backdrop-blur-sm text-white absolute bottom-0 flex items-center justify-center py-2">
        <h3>{data.category}</h3>
      </div>
    </div>
  );
};

export default CategoryCard;
