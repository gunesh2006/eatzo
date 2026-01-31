import React from "react";
import { useDispatch, useSelector } from "react-redux";
import FoodCard from "../components/FoodCard";
import { setSearchQuery } from "../redux/userSlice";
import { IoSearch } from "react-icons/io5";
import { useState, useEffect } from "react";
const AllProducts = () => {
  const { allItems } = useSelector((state) => state.user);
  const { searchQuery } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  console.log(allItems);
  let [filteredProduct, setFilterProduct] = useState([]);
  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilterProduct(
        allItems?.filter((item) =>
          item?.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    } else {
      setFilterProduct(allItems);
    }
  }, [allItems, searchQuery]);
  return (
    <div className="min-h-screen w-full bg-primary-dull-bg flex flex-col px-5 sm:px-10 md:px-15 lg:px-25">
      <p className="text-2xl font-semibold text-center mt-7 text-primary">
        All Products
      </p>
      <div className="w-full flex items-center justify-center mt-4 ">
        <IoSearch
          size={33}
          className="bg-primary text-white py-1 flex items-center justify-center px-1 rounded-l"
        />
        <input
          className="max-w-xl w-full outline-none border border-primary/40 px-2 py-1 rounded-r"
          type="text"
          placeholder="search something"
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      </div>

      <div className="w-full grid grid-cols-1 gap-5 px-5 sm:px-10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mt-10">
        {filteredProduct?.map((item, idx) => (
          <FoodCard data={item} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
