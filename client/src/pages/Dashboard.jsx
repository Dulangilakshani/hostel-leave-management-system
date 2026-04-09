import React, { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserGraduate,
  FaSignOutAlt,
  FaHistory,
  FaMoon,
  FaSun,
  FaWalking,
  FaUndo,
} from "react-icons/fa";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [leaveType, setLeaveType] = useState("day_out");
  const [returnTime, setReturnTime] = useState("");
  const [loadingLeave, setLoadingLeave] = useState(false);
  const [loadingReturn, setLoadingReturn] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const handleLeave = async () => {
    if (!returnTime) {
      alert("Please select expected return time");
      return;
    }

    try {
      setLoadingLeave(true);
      const res = await API.post("/leave/create", {
        leaveType,
        expectedReturnDateTime: returnTime,
      });
      alert(res.data.message);
      setReturnTime("");
    } catch (error) {
      alert(error.response?.data?.message || "Leave failed");
    } finally {
      setLoadingLeave(false);
    }
  };

  const handleReturn = async () => {
    try {
      setLoadingReturn(true);
      const res = await API.put("/leave/return");
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Return failed");
    } finally {
      setLoadingReturn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const toggleDarkMode = () => {
    const html = document.documentElement;

    if (darkMode) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-slate-700 dark:to-slate-900 text-white shadow-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FaUserGraduate />
              Student Dashboard
            </h1>
            <p className="mt-1 text-sm opacity-90">
              Welcome back, {user?.name}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={toggleDarkMode}
              className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl hover:bg-white/30 transition flex items-center gap-2"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600 transition flex items-center gap-2"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>

        {/* INFO + QUICK STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <p className="text-sm text-gray-500 dark:text-slate-400">Name</p>
            <h2 className="mt-2 text-xl font-bold text-slate-800 dark:text-white">
              {user?.name}
            </h2>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <p className="text-sm text-gray-500 dark:text-slate-400">Registration No</p>
            <h2 className="mt-2 text-xl font-bold text-slate-800 dark:text-white">
              {user?.regNo}
            </h2>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <p className="text-sm text-gray-500 dark:text-slate-400">Room Number</p>
            <h2 className="mt-2 text-xl font-bold text-slate-800 dark:text-white">
              {user?.roomNumber}
            </h2>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <p className="text-sm text-gray-500 dark:text-slate-400">Year</p>
            <h2 className="mt-2 text-xl font-bold text-slate-800 dark:text-white">
              {user?.year}
            </h2>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEAVE FORM */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-5 text-slate-800 dark:text-white">
              Leave Form
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Leave Type
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="day_out">Day Out</option>
                  <option value="out_going">Out Going</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Expected Return Time
                </label>
                <input
                  type="datetime-local"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleLeave}
                disabled={loadingLeave}
                className="rounded-xl bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700 disabled:bg-green-400 flex items-center gap-2"
              >
                <FaWalking />
                {loadingLeave ? "Submitting..." : "Submit Leave"}
              </button>

              <button
                onClick={handleReturn}
                disabled={loadingReturn}
                className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
              >
                <FaUndo />
                {loadingReturn ? "Processing..." : "Mark Return"}
              </button>

              <Link to="/history">
                <button className="rounded-xl bg-slate-800 dark:bg-slate-700 px-5 py-3 font-medium text-white transition hover:bg-slate-900 dark:hover:bg-slate-600 flex items-center gap-2">
                  <FaHistory />
                  View History
                </button>
              </Link>
            </div>
          </div>

          {/* SIDE PANEL */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-5 text-slate-800 dark:text-white">
              Student Info
            </h3>

            <div className="space-y-4 text-sm">
              <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-4">
                <p className="text-slate-500 dark:text-slate-400">Full Name</p>
                <p className="font-semibold text-slate-800 dark:text-white">
                  {user?.name}
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-4">
                <p className="text-slate-500 dark:text-slate-400">Role</p>
                <p className="font-semibold text-slate-800 dark:text-white">
                  {user?.role}
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-4">
                <p className="text-slate-500 dark:text-slate-400">Room</p>
                <p className="font-semibold text-slate-800 dark:text-white">
                  {user?.roomNumber}
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-4">
                <p className="text-slate-500 dark:text-slate-400">Year</p>
                <p className="font-semibold text-slate-800 dark:text-white">
                  {user?.year}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;