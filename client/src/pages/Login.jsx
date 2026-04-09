import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import facultyImg from "../assets/faculty.jpg";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    regNo: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    regNo: "",
    email: "",
    password: "",
    roomNumber: "",
    year: "",
  });

  const [resetData, setResetData] = useState({
    regNo: "",
    newPassword: "",
  });

  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignupChange = (e) => {
    setSignupData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleResetChange = (e) => {
    setResetData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.regNo || !loginData.password) {
      alert("Please fill all login fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        regNo: loginData.regNo.trim(),
        password: loginData.password,
      };

      const res = await API.post("/auth/login", payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "warden") {
        navigate("/warden");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    const { name, regNo, email, password, roomNumber, year } = signupData;

    if (!name || !regNo || !email || !password || !roomNumber || !year) {
      alert("Please fill all signup fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...signupData,
        regNo: signupData.regNo.trim(),
        year: Number(year),
      };

      const res = await API.post("/auth/register", payload);

      alert(res.data.message || "Student registered successfully");

      setSignupData({
        name: "",
        regNo: "",
        email: "",
        password: "",
        roomNumber: "",
        year: "",
      });

      setIsSignup(false);

      setLoginData({
        regNo: payload.regNo,
        password: "",
      });
    } catch (error) {
      console.log("SIGNUP ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (!resetData.regNo || !resetData.newPassword) {
      alert("Please fill all reset fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        regNo: resetData.regNo.trim(),
        newPassword: resetData.newPassword,
      };

      const res = await API.put("/auth/reset-password", payload);

      alert(res.data.message || "Password reset successful");

      setResetData({
        regNo: "",
        newPassword: "",
      });

      setShowForgot(false);
    } catch (error) {
      console.log("RESET ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:block h-full">
          <img
            src={facultyImg}
            alt="Faculty"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-8 md:p-10">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Hostel Leave System
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {showForgot
                ? "Reset your password"
                : isSignup
                ? "Create a new student account"
                : "Sign in to continue"}
            </p>
          </div>

          {!showForgot && (
            <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setIsSignup(false)}
                className={`w-1/2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  !isSignup
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => setIsSignup(true)}
                className={`w-1/2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  isSignup
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {showForgot ? (
            <form onSubmit={handleResetSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="regNo"
                  placeholder="Enter your registration number"
                  value={resetData.regNo}
                  onChange={handleResetChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="flex gap-2">
                  <input
                    type={showResetPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter new password"
                    value={resetData.newPassword}
                    onChange={handleResetChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="rounded-xl bg-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    {showResetPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-400"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="w-full rounded-xl bg-slate-200 py-3 font-semibold text-slate-700 transition hover:bg-slate-300"
              >
                Back to Login
              </button>
            </form>
          ) : !isSignup ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="regNo"
                  placeholder="Enter your registration number"
                  value={loginData.regNo}
                  onChange={handleLoginChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="flex gap-2">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="rounded-xl bg-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    {showLoginPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="regNo"
                  placeholder="Enter registration number"
                  value={signupData.regNo}
                  onChange={handleSignupChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="flex gap-2">
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="rounded-xl bg-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    {showSignupPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Room Number
                </label>
                <input
                  type="text"
                  name="roomNumber"
                  placeholder="Enter room number"
                  value={signupData.roomNumber}
                  onChange={handleSignupChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  placeholder="Enter year"
                  value={signupData.year}
                  onChange={handleSignupChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
              >
                {loading ? "Creating account..." : "Sign Up as Student"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;