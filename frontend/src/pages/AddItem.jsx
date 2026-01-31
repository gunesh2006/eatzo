import React from "react";
import { IoMdAdd } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";
import { GoPencil } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";

const AddItem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { myShopData } = useSelector((state) => state.owner);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [itemCategory, setItemCategory] = useState("");
  const [itemFoodType, setItemFoodType] = useState("Veg");
  const categories = [
    "Snakcs",
    "Main Course",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwitches",
    "South Indian",
    "North Indian",
    "Chinese",
    "Fast Food",
    "Others",
  ];

  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", itemName);
      formData.append("category", itemCategory);
      formData.append("foodType", itemFoodType);
      formData.append("price", itemPrice);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/item/add-item`,
        formData,
        { withCredentials: true }
      );
      console.log(result.data);
      dispatch(setMyShopData(result.data));
      navigate("/");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-primary-dull-bg">
      <IoIosArrowRoundBack
        size={30}
        className="absolute top-2 left-3 text-primary cursor-pointer"
        onClick={() => navigate("/")}
      />
      <div className="bg-white w-md flex flex-col px-5 py-4 rounded shadow-lg">
        <div className="flex flex-col gap-3 items-center justify-center">
          <div className="flex flex-row w-full items-center justify-center gap-3">
            <div className="bg-primary rounded-full flex items-center justify-center p-3 text-white">
              <IoMdAdd size={30} />
            </div>
            <p className="text-3xl text-primary font-semibold">Add Item</p>
          </div>
          <form
            className="flex flex-col w-full items-start justify-center gap-1 mt-4"
            onSubmit={handleSubmit}
          >
            {/* name */}
            <div className="w-full">
              <label htmlFor="name" className="text-sm">
                Item Name
              </label>
              <input
                className="outline-none p-2 border border-primary-dull rounded w-full"
                type="text"
                placeholder="Enter Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              ></input>
            </div>

            {/* image */}
            <div className="mt-2 w-full">
              <label htmlFor="image" className="text-sm">
                Item Image
              </label>
              <input
                className="outline-none p-2 border border-primary-dull rounded w-full "
                type="file"
                onChange={handleImage}
              ></input>
              {frontendImage && (
                <div className="mt-2">
                  <img
                    src={frontendImage}
                    className="w-full h-48 object-contain rounded-lg border border-primary-dull"
                  />
                </div>
              )}
            </div>
            {/* {price} */}
            <div className="w-full">
              <label htmlFor="name" className="text-sm">
                Price
              </label>
              <input
                className="outline-none p-2 border border-primary-dull rounded w-full"
                type="number"
                placeholder="Enter Price"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
              ></input>
            </div>

            {/* {category} */}
            <div className="w-full">
              <label htmlFor="name" className="text-sm">
                Category
              </label>
              <select
                className="outline-none p-2 border border-primary-dull rounded w-full"
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((category, idx) => (
                  <option value={category} key={idx}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* {food type} */}
            <div className="w-full">
              <label htmlFor="name" className="text-sm">
                Food Type
              </label>
              <select
                className="outline-none p-2 border border-primary-dull rounded w-full"
                value={itemFoodType}
                onChange={(e) => setItemFoodType(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>
            </div>
            <button
              className="w-full bg-primary text-white px-3 py-2 cursor-pointer rounded mt-4 text-lg"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Add Item"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
