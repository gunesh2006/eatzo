import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setAllItems } from "../redux/userSlice.js";

const useGetAllItems = () => {
  const dispatch = useDispatch();
  const { allItems, city, userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/item/get-all-items-by-city/${city}`,
          {
            withCredentials: true,
          }
        );

        if (result?.data) {
          dispatch(setAllItems(result.data));
        }
        console.log(result?.data);
      } catch (error) {
        console.log(`fetch user error:${error}`);
      }
    };
    fetchItems();
  }, [city, userData]);
};

export default useGetAllItems;
