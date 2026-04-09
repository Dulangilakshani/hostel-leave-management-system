import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { FaHistory, FaArrowLeft, FaSignOutAlt, FaMoon, FaSun } from "react-icons/fa";

function History() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/leave/my-history");
      console.log("HISTORY DATA:", res.data);
      setLeaves(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("HISTORY ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "-";
    return new Date(dateTime).toLocaleString();
  };

  const formatLeaveType = (type) => {
    if (type === "day_out") return "Day Out";
    if (type === "out_going") return "Out Going";
    return type;
  };

  const formatStatus = (status) => {
    if (status === "on_time") return "On Time";
    if (status === "late") return "Late";
    if (status === "pending") return "Pending";
    return status;
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
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* HEADER */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-slate-700 dark:to-slate-900 text-white shadow-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FaHistory />
              My Leave History
            </h1>
            <p className="mt-1 text-sm opacity-90">
              View all your past leave and return records
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

            <Link to="/dashboard">
              <button className="bg-blue-500 px-4 py-2 rounded-xl hover:bg-blue-600 transition flex items-center gap-2">
                <FaArrowLeft />
                Back
              </button>
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600 transition flex items-center gap-2"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-md">
          {loading ? (
            <div className="p-6 text-slate-600 dark:text-slate-300">
              Loading history...
            </div>
          ) : !leaves || leaves.length === 0 ? (
            <div className="p-6 text-slate-600 dark:text-slate-300">
              No leave records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-800 dark:bg-slate-700 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Leave Type</th>
                    <th className="px-4 py-3 text-left">Leave Time</th>
                    <th className="px-4 py-3 text-left">Expected Return</th>
                    <th className="px-4 py-3 text-left">Return Time</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave, index) => (
                    <tr
                      key={leave._id}
                      className={`border-b border-slate-200 dark:border-slate-700 ${
                        index % 2 === 0
                          ? "bg-white dark:bg-slate-900"
                          : "bg-slate-50 dark:bg-slate-800"
                      } hover:bg-slate-100 dark:hover:bg-slate-700 transition`}
                    >
                      <td className="px-4 py-3 text-slate-800 dark:text-white font-medium">
                        {formatLeaveType(leave.leaveType)}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {formatDateTime(leave.leaveDateTime)}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {formatDateTime(leave.expectedReturnDateTime)}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {formatDateTime(leave.returnDateTime)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            leave.status === "on_time"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : leave.status === "late"
                              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {formatStatus(leave.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* FOOTER INFO CARD */}
        {!loading && leaves.length > 0 && (
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-md p-6">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Records</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
                {leaves.length}
              </h2>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-md p-6">
              <p className="text-sm text-slate-500 dark:text-slate-400">Late Records</p>
              <h2 className="mt-2 text-3xl font-bold text-red-600">
                {leaves.filter((item) => item.status === "late").length}
              </h2>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-md p-6">
              <p className="text-sm text-slate-500 dark:text-slate-400">On Time Records</p>
              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {leaves.filter((item) => item.status === "on_time").length}
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;