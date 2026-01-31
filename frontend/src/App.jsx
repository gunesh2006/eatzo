import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/signup";
import Signin from "./pages/Signin";
import ForgotPassword from "./pages/ForgotPassword";
import { Toaster } from "react-hot-toast";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import useGetCity from "./hooks/useGetCity";
import useGetMyShop from "./hooks/useGetMyShop";
import CreateEditShop from "./pages/CreateEditShop";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import CartPage from "./pages/CartPage";
import { setSocket, setUserData } from "./redux/userSlice";
import { setMyShopData } from "./redux/ownerSlice";
import useGetShopByCity from "./hooks/useGetShopByCity";
import useGetAllItems from "./hooks/useGetAllItems";
import CheckOutPage from "./pages/CheckOutPage";
import OrderPlaced from "./pages/OrderPlaced";
import MyOrders from "./pages/MyOrders";
import useGetMyOrders from "./hooks/useGetMyOrders";
import useUpdateLocation from "./hooks/useUpdateLocation";
import TrackOrderPage from "./pages/TrackOrderPage";
import Shop from "./pages/Shop";
import AllProducts from "./pages/AllProducts";
import { io } from "socket.io-client";
export const serverUrl = "http://localhost:8000";
const App = () => {
  useGetCurrentUser();
  useGetMyShop();
  useGetCity();
  useGetShopByCity();
  useGetAllItems();
  useGetMyOrders();
  useUpdateLocation();

  const { userData } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner);
  const dispatch = useDispatch();

  useEffect(() => {
    const socketInstance = io(serverUrl, { withCredentials: true }); // connect to backend
    dispatch(setSocket(socketInstance));
    socketInstance.on("connect", () => {
      if (userData) {
        socketInstance.emit("identity", { userId: userData._id });
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [userData]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/signup"
          element={!userData ? <Signup /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signin"
          element={!userData ? <Signin /> : <Navigate to={"/"} />}
        />
        <Route
          path="/forgot-password"
          element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}
        />
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/create-edit-shop"
          element={userData ? <CreateEditShop /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/add-item"
          element={userData ? <AddItem /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/edit-item/:itemId"
          element={userData ? <EditItem /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/cart"
          element={userData ? <CartPage /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/checkout"
          element={userData ? <CheckOutPage /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/order-placed"
          element={userData ? <OrderPlaced /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/my-orders"
          element={userData ? <MyOrders /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/track-order/:orderId"
          element={userData ? <TrackOrderPage /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/shop/:shopId"
          element={userData ? <Shop /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/all-products"
          element={userData ? <AllProducts /> : <Navigate to={"/signin"} />}
        />
      </Routes>
    </>
  );
};

export default App;
