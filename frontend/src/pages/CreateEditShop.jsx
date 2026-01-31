import React from "react";
import { IoMdAdd } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";
import { GoPencil } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";

const CreateEditShop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { myShopData } = useSelector((state) => state.owner);
  const [shopName, setShopName] = useState(myShopData?.name || "");
  const [shopCity, setShopCity] = useState(myShopData?.city || "");
  const [shopState, setShopState] = useState(myShopData?.state || "");
  const [shopAddress, setShopAddress] = useState(myShopData?.address || "");
  const [frontendImage, setFrontendImage] = useState(myShopData?.image || "");
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
      formData.append("name", shopName);
      formData.append("city", shopCity);
      formData.append("state", shopState);
      formData.append("address", shopAddress);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/shop/create-edit`,
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
              {!myShopData ? <IoMdAdd size={30} /> : <GoPencil size={30} />}
            </div>
            <p className="text-3xl text-primary font-semibold">
              {!myShopData ? "List Shop" : "Edit Shop"}
            </p>
          </div>
          <form
            className="flex flex-col w-full items-start justify-center gap-1 mt-4"
            onSubmit={handleSubmit}
          >
            {/* name */}
            <div className="w-full">
              <label htmlFor="name" className="text-sm">
                Shop Name
              </label>
              <input
                className="outline-none p-2 border border-primary-dull rounded w-full"
                type="text"
                placeholder="Enter Shop Name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
              ></input>
            </div>

            {/* image */}
            <div className="mt-2 w-full">
              <label htmlFor="image" className="text-sm">
                Shop Image
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

            {/* city */}
            <div className="mt-2 w-full grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="city" className="text-sm">
                  City
                </label>
                <input
                  className="outline-none p-2 border border-primary-dull rounded w-full"
                  type="text"
                  placeholder="Enter City"
                  value={shopCity}
                  onChange={(e) => setShopCity(e.target.value)}
                ></input>
              </div>
              <div>
                <label htmlFor="state" className="text-sm">
                  State
                </label>
                <input
                  className="outline-none p-2 border border-primary-dull rounded w-full"
                  type="text"
                  placeholder="Enter State"
                  value={shopState}
                  onChange={(e) => setShopState(e.target.value)}
                ></input>
              </div>
            </div>

            {/* address */}
            <div className="mt-2 w-full">
              <label htmlFor="address" className="text-sm">
                Address
              </label>
              <input
                className="outline-none p-2 border border-primary-dull rounded w-full"
                type="text"
                placeholder="Enter Address"
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
              ></input>
            </div>

            <button
              className="w-full bg-primary text-white px-3 py-2 cursor-pointer rounded mt-4 text-lg"
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : myShopData ? (
                "Save Changes"
              ) : (
                "Add Shop"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEditShop;
