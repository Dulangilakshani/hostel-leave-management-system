import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    regNo: "",
    email: "",
    password: "",
    roomNumber: "",
    year: "",
    role: "student",
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      alert("Please fill all login fields");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", loginData);

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

    const { name, regNo, email, password, roomNumber, year, role } = signupData;

    if (!name || !regNo || !email || !password || !roomNumber || !year) {
      alert("Please fill all signup fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...signupData,
        year: Number(year),
      };

      const res = await API.post("/auth/register", payload);

      alert(res.data.message || "User registered successfully");

      setSignupData({
        name: "",
        regNo: "",
        email: "",
        password: "",
        roomNumber: "",
        year: "",
        role: "student",
      });

      setIsSignup(false);
    } catch (error) {
      console.log("SIGNUP ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Hostel Leave System
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {isSignup ? "Create a new account" : "Sign in to continue"}
          </p>
        </div>

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

        {!isSignup ? (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={handleLoginChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
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
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={signupData.password}
                onChange={handleSignupChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
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

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={signupData.role}
                onChange={handleSignupChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="student">Student</option>
                <option value="warden">Warden</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;