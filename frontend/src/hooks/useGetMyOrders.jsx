import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";

import { setMyOrders } from "../redux/userSlice.js";

const useGetMyOrders = () => {
  const dispatch = useDispatch();
  let { userData } = useSelector((state) => state.user);
  try {
    useEffect(() => {
      const fetchOrders = async () => {
        const result = await axios.get(`${serverUrl}/api/order/my-orders`, {
          withCredentials: true,
        });

        if (result?.data) {
          dispatch(setMyOrders(result.data));
        }
        console.log(result?.data);
      };

      fetchOrders();
    }, [userData]);
  } catch (error) {
    console.log(error.message);
  }
};

export default useGetMyOrders;
