import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { serverUrl } from "../App";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
const ForgotPassword = () => {
  let [email, setEmail] = useState("");
  let [otp, setOtp] = useState("");
  let [step, setStep] = useState(1);
  let [newPassword, setNewPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        {
          email,
        },
        { withCredentials: true }
      );
      console.log(result);
      setStep(2);
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        {
          email,
          otp,
        },
        { withCredentials: true }
      );
      console.log(result);
      setStep(3);
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    if (newPassword != confirmPassword) {
      return null;
    }
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        {
          email,
          newPassword,
        },
        { withCredentials: true }
      );
      console.log(result);
      navigate("/signin");
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setLoading(false);
    }
  };
  return (
    <div className="flex w-full h-screen items-center justify-center bg-primary-dull">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl flex items-center justify-start gap-3 text-primary font-bold mb-2">
          <IoIosArrowRoundBack
            className="cursor-pointer"
            size={30}
            onClick={() => navigate("/signin")}
          />
          Forgot Password
        </h1>

        {/* step-1 */}
        {step === 1 && (
          <>
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

            <button
              className="w-full p-2 text-white bg-primary rounded flex items-center justify-center mt-4 cursor-pointer hover:opacity-90"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Send OTP"}
            </button>
          </>
        )}

        {/* step-2 */}
        {step === 2 && (
          <>
            <div className="flex flex-col gap-2 mb-2">
              <label htmlFor="otp" className="text-gray-600">
                OTP
              </label>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="p-2 text-gray-600 w-full outline-none border border-primary-dull rounded"
                required
              />
            </div>

            <button
              className="w-full p-2 text-white bg-primary rounded flex items-center justify-center mt-4 cursor-pointer hover:opacity-90"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Verify OTP"}
            </button>
          </>
        )}

        {/* step-3 */}
        {step === 3 && (
          <>
            <div className="flex flex-col gap-2 mb-2 mt-5">
              <label htmlFor="newPassword" className="text-gray-600">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="p-2 text-gray-600 w-full outline-none border border-primary-dull rounded"
                required
              />
            </div>

            <div className="flex flex-col gap-2 mb-2">
              <label htmlFor="confirmPassword" className="text-gray-600">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="p-2 text-gray-600 w-full outline-none border border-primary-dull rounded"
                required
              />
            </div>

            <button
              className="w-full p-2 text-white bg-primary rounded flex items-center justify-center mt-4 cursor-pointer hover:opacity-90"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                "Change Password"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
