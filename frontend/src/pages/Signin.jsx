import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
const Signin = () => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [showPassword, setShowPassword] = useState(false);
  let [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSignIn = async () => {
    setLoading(true);
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password,
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
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          email: result.user.email,
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
          Cravings ? Sign In and get it delievered at your speed
        </p>

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
          <p
            className="text-right text-sm text-primary cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </p>
        </div>

        {/* signIn Button */}
        <button
          className="w-full p-2 text-white bg-primary rounded flex items-center justify-center mt-4 cursor-pointer hover:opacity-90"
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Sign In"}
        </button>

        {/* signIn with google */}

        <button
          className="w-full p-2 text-gray-600 border border-primary-dull bg-white rounded flex items-center justify-center cursor-pointer hover:bg-gray-100 gap-2 mt-3"
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={20} /> Sign In with google
        </button>
        <p className="mt-2 text-center text-sm">
          Create a new account?{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signin;
