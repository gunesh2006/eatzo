import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });

        if (result?.data) {
          dispatch(setUserData(result.data));
        }
      } catch (error) {
        console.log(`fetch user error:${error}`);
      }
    };
    fetchUser();
  }, []);
};

export default useGetCurrentUser;
