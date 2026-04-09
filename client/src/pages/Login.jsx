import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import facultyImg from "../assets/faculty.jpg";
import {
  FaUserGraduate,
  FaIdCard,
  FaEnvelope,
  FaLock,
  FaDoorOpen,
  FaCalendarAlt,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaUserPlus,
  FaKey,
  FaUniversity,
  FaShieldAlt,
  FaClock,
  FaChartLine,
} from "react-icons/fa";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-7xl overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl ring-1 ring-white/20 grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT BRANDING PANEL */}
        <div className="relative hidden lg:block min-h-[820px]">
          <img
            src={facultyImg}
            alt="Faculty"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/55 to-indigo-900/25" />

          <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
            <div>
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/20">
                  <FaUniversity className="text-3xl" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-200">
                    University of Ruhuna - Technology Faculty
                  </p>
                  <h2 className="text-2xl font-bold">
                    Hostel Leave Management
                  </h2>
                </div>
              </div>

              <p className="mb-3 inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-semibold tracking-wide backdrop-blur">
                Digital Student Movement Tracking
              </p>

              <h3 className="max-w-lg text-4xl font-bold leading-tight">
                Manage hostel leave requests, returns, and warden monitoring in one smart system.
              </h3>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-200">
                Built for modern campus administration with real-time leave records,
                faster student access, secure authentication, and cleaner reporting.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-white/10 backdrop-blur p-4 ring-1 ring-white/15">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/30">
                    <FaShieldAlt />
                  </div>
                  <div>
                    <h4 className="font-semibold">Secure Access</h4>
                    <p className="text-sm text-slate-200">
                      Registration-number based login with protected student and warden dashboards.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur p-4 ring-1 ring-white/15">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/30">
                    <FaClock />
                  </div>
                  <div>
                    <h4 className="font-semibold">Real-Time Leave Tracking</h4>
                    <p className="text-sm text-slate-200">
                      Record leave and return times instantly with late return detection.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur p-4 ring-1 ring-white/15">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/30">
                    <FaChartLine />
                  </div>
                  <div>
                    <h4 className="font-semibold">Reports & Analytics</h4>
                    <p className="text-sm text-slate-200">
                      View reports, charts, and downloadable summaries for hostel management.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-xs text-slate-300">
                Faculty of Computing • Student Services • Secure Access Portal
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                {showForgot ? (
                  <FaKey className="text-2xl" />
                ) : isSignup ? (
                  <FaUserPlus className="text-2xl" />
                ) : (
                  <FaSignInAlt className="text-2xl" />
                )}
              </div>

              <h1 className="text-3xl font-bold text-white">
                Hostel Leave System
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                {showForgot
                  ? "Reset your password securely"
                  : isSignup
                  ? "Create a new student account"
                  : "Sign in to continue"}
              </p>
            </div>

            {!showForgot && (
              <div className="mb-6 flex rounded-2xl bg-white/10 p-1 backdrop-blur">
                <button
                  type="button"
                  onClick={() => setIsSignup(false)}
                  className={`w-1/2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    !isSignup
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => setIsSignup(true)}
                  className={`w-1/2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isSignup
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {showForgot ? (
              <form
                onSubmit={handleResetSubmit}
                className="space-y-5 rounded-3xl bg-white/10 p-6 backdrop-blur-xl ring-1 ring-white/20"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Registration Number
                  </label>
                  <div className="relative">
                    <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="regNo"
                      placeholder="Enter your registration number"
                      value={resetData.regNo}
                      onChange={handleResetChange}
                      className="w-full rounded-2xl border border-white/15 bg-white/10 pl-11 pr-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    New Password
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showResetPassword ? "text" : "password"}
                        name="newPassword"
                        placeholder="Enter new password"
                        value={resetData.newPassword}
                        onChange={handleResetChange}
                        className="w-full rounded-2xl border border-white/15 bg-white/10 pl-11 pr-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="rounded-2xl bg-white/10 px-4 py-3 text-slate-200 transition hover:bg-white/20"
                    >
                      {showResetPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-semibold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="w-full rounded-2xl bg-white/10 py-3 font-semibold text-slate-200 transition hover:bg-white/20"
                >
                  Back to Login
                </button>
              </form>
            ) : !isSignup ? (
              <form
                onSubmit={handleLoginSubmit}
                className="space-y-5 rounded-3xl bg-white/10 p-6 backdrop-blur-xl ring-1 ring-white/20"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Registration Number
                  </label>
                  <div className="relative">
                    <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="regNo"
                      placeholder="Enter your registration number"
                      value={loginData.regNo}
                      onChange={handleLoginChange}
                      className="w-full rounded-2xl border border-white/15 bg-white/10 pl-11 pr-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="w-full rounded-2xl border border-white/15 bg-white/10 pl-11 pr-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="rounded-2xl bg-white/10 px-4 py-3 text-slate-200 transition hover:bg-white/20"
                    >
                      {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-sm font-medium text-blue-300 hover:text-blue-200"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleSignupSubmit}
                className="space-y-4 rounded-3xl bg-white/10 p-6 backdrop-blur-xl ring-1 ring-white/20"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUserGraduate className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter full name"
                      value={signupData.name}
                      onChange={handleSignupChange}
                      className="w-full rounded-2xl border border-white/15 bg-white/10 pl-11 pr-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Registration Number
                  </label>
                  <div className="relative">
                    <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="regNo"
                      placeholder="Enter registration number"
                      value={signupData.regNo}
                      onChange={handleSignupChange}
                      className="w-full rounded-2xl border border-white/15 bg-white/10 pl-11 pr-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Email
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      className="w-full rounded-2xl border border-white/15 bg-white/10 pl-11 pr-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showSignupPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter password"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        className="w-full rounded-2xl border border-white/15 bg-white/10 pl-11 pr-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="rounded-2xl bg-white/10 px-4 py-3 text-slate-200 transition hover:bg-white/20"
                    >
                      {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Room Number
                  </label>
                  <div className="relative">
                    <FaDoorOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="roomNumber"
                      placeholder="Enter room number"
                      value={signupData.roomNumber}
                      onChange={handleSignupChange}
                      className="w-full rounded-2xl border border-white/15 bg-white/10 pl-11 pr-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Year
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      name="year"
                      placeholder="Enter year"
                      value={signupData.year}
                      onChange={handleSignupChange}
                      className="w-full rounded-2xl border border-white/15 bg-white/10 pl-11 pr-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 py-3 font-semibold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating account..." : "Sign Up as Student"}
                </button>
              </form>
            )}

            <div className="mt-6 text-center text-xs text-slate-400">
              Secure campus access portal • Hostel administration system
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;