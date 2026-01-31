import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setShopInMyCity, setUserData } from "../redux/userSlice.js";

const useGetShopByCity = () => {
  const dispatch = useDispatch();
  const { city } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/shop/get-shop-by-city/${city}`,
          {
            withCredentials: true,
          }
        );

        if (result?.data) {
          dispatch(setShopInMyCity(result.data));
        }
        console.log(result?.data);
      } catch (error) {
        console.log(`fetch user error:${error}`);
      }
    };
    fetchShop();
  }, [city]);
};

export default useGetShopByCity;
