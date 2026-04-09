import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  FaUserShield,
  FaSignOutAlt,
  FaChartBar,
  FaMoon,
  FaSun,
  FaFilter,
  FaUsers,
  FaExclamationTriangle,
} from "react-icons/fa";

function WardenDashboard() {
  const [currentOut, setCurrentOut] = useState([]);
  const [late, setLate] = useState([]);
  const [report, setReport] = useState({
    total: 0,
    late: 0,
    onTime: 0,
    pending: 0,
  });
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [year, setYear] = useState("");
  const [room, setRoom] = useState("");
  const [type, setType] = useState("");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [outRes, lateRes, reportRes] = await Promise.all([
        API.get("/leave/current-out"),
        API.get("/leave/late"),
        API.get("/leave/report"),
      ]);

      setCurrentOut(outRes.data);
      setLate(lateRes.data);
      setReport(reportRes.data);
    } catch (error) {
      console.log(
        "WARDEN DASHBOARD ERROR:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      const params = new URLSearchParams();

      if (year) params.append("year", year);
      if (room) params.append("roomNumber", room);
      if (type) params.append("leaveType", type);

      const res = await API.get(`/leave/filter?${params.toString()}`);
      setFiltered(res.data);
    } catch (error) {
      console.log("FILTER ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Filter failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleReports = () => {
    navigate("/reports");
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

  const formatLeaveType = (leaveType) => {
    if (leaveType === "day_out") return "Day Out";
    if (leaveType === "out_going") return "Out Going";
    return leaveType;
  };

  const formatStatus = (status) => {
    if (status === "on_time") return "On Time";
    if (status === "late") return "Late";
    if (status === "pending") return "Pending";
    return status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* HEADER */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-slate-700 dark:to-slate-900 text-white shadow-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FaUserShield />
              Warden Dashboard
            </h1>
            <p className="mt-1 text-sm opacity-90">
              Welcome, {user?.name}
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
              onClick={handleReports}
              className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl hover:bg-white/30 transition flex items-center gap-2"
            >
              <FaChartBar />
              Reports
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

        {/* SUMMARY CARDS */}
        <div className="mb-6 grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-md hover:shadow-xl transition">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Leaves
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
              {report.total}
            </h2>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-md hover:shadow-xl transition">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Late Returns
            </p>
            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {report.late}
            </h2>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-md hover:shadow-xl transition">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              On Time
            </p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {report.onTime}
            </h2>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-md hover:shadow-xl transition">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Pending
            </p>
            <h2 className="mt-2 text-3xl font-bold text-yellow-600">
              {report.pending}
            </h2>
          </div>
        </div>

        {/* FILTER SECTION */}
        <div className="mb-6 rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-md">
          <h3 className="mb-4 text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <FaFilter />
            Filter Records
          </h3>

          <div className="grid gap-4 md:grid-cols-3">
            <input
              type="text"
              placeholder="Year (2025)"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <input
              type="text"
              placeholder="Room Number (A101)"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">All Types</option>
              <option value="day_out">Day Out</option>
              <option value="out_going">Out Going</option>
            </select>
          </div>

          <button
            onClick={handleFilter}
            className="mt-4 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Apply Filter
          </button>
        </div>

        {/* FILTERED RESULTS */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-md">
          <div className="border-b border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
              Filtered Results
            </h3>
          </div>

          {filtered.length === 0 ? (
            <div className="p-5 text-slate-600 dark:text-slate-300">
              No filtered results yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-800 dark:bg-slate-700 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Room</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, index) => (
                    <tr
                      key={item._id}
                      className={`border-b border-slate-200 dark:border-slate-700 ${
                        index % 2 === 0
                          ? "bg-white dark:bg-slate-900"
                          : "bg-slate-50 dark:bg-slate-800"
                      } hover:bg-slate-100 dark:hover:bg-slate-700 transition`}
                    >
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {item.roomNumber}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {formatLeaveType(item.leaveType)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === "on_time"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : item.status === "late"
                              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {formatStatus(item.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* TWO TABLES */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* CURRENT OUT */}
          <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-md">
            <div className="border-b border-slate-200 dark:border-slate-700 p-5">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <FaUsers />
                Students Currently Out
              </h3>
            </div>

            {loading ? (
              <div className="p-5 text-slate-600 dark:text-slate-300">
                Loading...
              </div>
            ) : currentOut.length === 0 ? (
              <div className="p-5 text-slate-600 dark:text-slate-300">
                No students currently out.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-800 dark:bg-slate-700 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Room</th>
                      <th className="px-4 py-3 text-left">Leave Type</th>
                      <th className="px-4 py-3 text-left">Leave Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOut.map((item, index) => (
                      <tr
                        key={item._id}
                        className={`border-b border-slate-200 dark:border-slate-700 ${
                          index % 2 === 0
                            ? "bg-white dark:bg-slate-900"
                            : "bg-slate-50 dark:bg-slate-800"
                        } hover:bg-slate-100 dark:hover:bg-slate-700 transition`}
                      >
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                          {item.name}
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                          {item.roomNumber}
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                          {formatLeaveType(item.leaveType)}
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                          {new Date(item.leaveDateTime).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* LATE RETURNS */}
          <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-md">
            <div className="border-b border-slate-200 dark:border-slate-700 p-5">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <FaExclamationTriangle />
                Late Returns
              </h3>
            </div>

            {loading ? (
              <div className="p-5 text-slate-600 dark:text-slate-300">
                Loading...
              </div>
            ) : late.length === 0 ? (
              <div className="p-5 text-slate-600 dark:text-slate-300">
                No late returns found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-800 dark:bg-slate-700 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Room</th>
                      <th className="px-4 py-3 text-left">Return Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {late.map((item, index) => (
                      <tr
                        key={item._id}
                        className={`border-b border-slate-200 dark:border-slate-700 ${
                          index % 2 === 0
                            ? "bg-white dark:bg-slate-900"
                            : "bg-slate-50 dark:bg-slate-800"
                        } hover:bg-slate-100 dark:hover:bg-slate-700 transition`}
                      >
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                          {item.name}
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                          {item.roomNumber}
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                          {item.returnDateTime
                            ? new Date(item.returnDateTime).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WardenDashboard;