import React from "react";
import { useSelector } from "react-redux";
import UserDashboard from "../components/UserDashboard";
import OwnerDashboard from "../components/OwnerDashboard";
import DeliveryBoyDashboard from "../components/DeliveryBoyDashboard";

const Home = () => {
  const userData = useSelector((state) => state.user);
  console.log(`home page userdata checking:${userData?.userData?.role}`);
  return (
    <div className="w-full min-h-screen bg-primary-dull-bg">
      {userData?.userData?.role === "User" && <UserDashboard />}
      {userData?.userData?.role === "Owner" && <OwnerDashboard />}
      {userData?.userData?.role === "DeliveryBoy" && <DeliveryBoyDashboard />}
    </div>
  );
};

export default Home;
