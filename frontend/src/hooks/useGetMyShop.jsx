import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";

import { setMyShopData } from "../redux/ownerSlice.js";

const useGetMyShop = () => {
  const dispatch = useDispatch();
  let { userData } = useSelector((state) => state.user);
  try {
    useEffect(() => {
      console.log(`User Data is: ${userData}`);
      const fetchShop = async () => {
        const result = await axios.get(`${serverUrl}/api/shop/get-my-shop`, {
          withCredentials: true,
        });

        if (result?.data) {
          dispatch(setMyShopData(result.data));
        }
      };

      fetchShop();
    }, [userData]);
  } catch (error) {
    console.log(error.message);
  }
};

export default useGetMyShop;
