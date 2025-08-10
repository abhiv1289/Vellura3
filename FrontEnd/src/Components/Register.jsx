import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import axios from "axios";

import Button from "./Button";
import OtpVerification from "./OtpVerification";

//Please add comment when adding or fixing anything in the code.

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [otpFlag, setOtpFlag] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const notifyError = (label) => toast.error(label);

  const handleSubmitRegister = (e) => {
    e.preventDefault();

    let length = password.length;
    if (length < 6) {
      alert("Password should be atleast 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsSubmitted(true);
  };

  useEffect(() => {
    if (!isSubmitted) return;

    const fetchData = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/register`,
          {
            username: username,
            name: fullName,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            dob: dob,
          }
        );
        // console.log(res.data.message);
        if (
          res.data.message === "User created successfully" ||
          res.data.message === "Lead to verify otp"
        )
          setOtpFlag(true); // Set OTP flag to true after successful registration
      } catch (error) {
        notifyError(error.response?.data.message);
        console.error("Error:", error.response?.data.message || error.message);
      } finally {
        setIsSubmitted(false);
      }
    };

    fetchData();
  }, [isSubmitted]);

  return (
    <>
      <Toaster />
      {!otpFlag ? (
        <form
          className="space-y-3 p-4 w-full shadow rounded-xl  h-96 overflow-y-scroll "
          onSubmit={handleSubmitRegister}
        >
          <div>
            <label className="block text-black font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Create an username"
              className="w-full mt-1 px-3 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-black font-medium">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your name"
              className="w-full mt-1 px-3 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-black font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-1 px-3 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-black font-medium">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-black font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full mt-1 px-3 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-black font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full mt-1 px-3 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <Button
            label="Register"
            type="submit"
            className="w-full !bg-orange-900 hover:!bg-orange-700 text-white"
          />
        </form>
      ) : (
        <OtpVerification
          isOtpSubmitted={isOtpSubmitted}
          setIsOtpSubmitted={setIsOtpSubmitted}
          email={email}
        />
      )}
    </>
  );
}

export default Register;
