import React from "react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ClipLoader } from "react-spinners";
import { auth } from "../../firebase.js";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
const Signup = () => {
  let [fullName, setFullName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [mobile, setMobile] = useState("");
  let [role, setRole] = useState("User");
  let [showPassword, setShowPassword] = useState(false);
  let [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          fullName,
          email,
          password,
          mobile,
          role,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(result?.data));
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!mobile) {
      return toast.error("mobile no is required");
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          mobile,
          role,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(data));
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className="flex w-full h-screen items-center justify-center bg-primary-dull">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl text-primary font-bold mb-2">Eatzo</h1>
        <p className="text-gray-600 mb-4">
          Cravings ? Sign up and get it delievered at your speed
        </p>

        {/* fullname */}
        <div className="flex flex-col gap-2 mb-2">
          <label htmlFor="fullname" className="text-gray-600">
            Full Name
          </label>
          <input
            type="text"
            name="fullname"
            placeholder="Enter Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="p-2 text-gray-600 w-full outline-none border border-primary-dull rounded"
            required
          />
        </div>

        {/* email */}
        <div className="flex flex-col gap-2 mb-2">
          <label htmlFor="email" className="text-gray-600">
            Email
          </label>
          <input
            type="text"
            name="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 text-gray-600 w-full outline-none border border-primary-dull rounded"
            required
          />
        </div>

        {/* password */}
        <div className="flex flex-col gap-2 mb-2">
          <label htmlFor="password" className="text-gray-600">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 text-gray-600 w-full outline-none border border-primary-dull rounded"
              required
            />
            <p
              className="absolute right-3 top-3.5 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? (
                <FaRegEye className="text-gray-600" />
              ) : (
                <FaRegEyeSlash className="text-gray-600" />
              )}
            </p>
          </div>
        </div>

        {/* mobile */}
        <div className="flex flex-col gap-2 mb-2">
          <label htmlFor="mobile" className="text-gray-600">
            Phone No.
          </label>
          <input
            type="text"
            name="mobile"
            placeholder="Enter Phone"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="p-2 text-gray-600 w-full outline-none border border-primary-dull rounded"
            required
          />
        </div>

        {/* role */}
        <p className="text-gray-600 mb-2">Role</p>
        <div className="w-full flex items-center justify-between  text-center">
          {["User", "Owner", "DeliveryBoy"].map((r) => (
            <div>
              <button
                className={
                  role === r
                    ? "px-3 sm:px-5 py-1 bg-primary transition-200s rounded text-white cursor-pointer hover:bg-primary/90 "
                    : "px-3 sm:px-5 py-1 border border-primary-dull rounded text-gray-600 cursor-pointer "
                }
                onClick={() => {
                  setRole(r);
                }}
              >
                {r}
              </button>
            </div>
          ))}
        </div>

        {/* signup Button */}
        <button
          className="w-full p-2 text-white bg-primary rounded flex items-center justify-center mt-4 cursor-pointer hover:opacity-90"
          disabled={loading}
          onClick={handleSignUp}
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Sign Up"}
        </button>

        {/* signup with google */}

        <button
          className="w-full p-2 text-gray-600 border border-primary-dull bg-white rounded flex items-center justify-center cursor-pointer hover:bg-gray-100 gap-2 mt-3"
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={20} /> Sign Up with google
        </button>

        <p className="mt-2 text-center text-sm">
          Already Have an account?{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
