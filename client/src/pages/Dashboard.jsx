import React, { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [leaveType, setLeaveType] = useState("day_out");
  const [returnTime, setReturnTime] = useState("");
  const [loadingLeave, setLoadingLeave] = useState(false);
  const [loadingReturn, setLoadingReturn] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Student Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your hostel leave and return records
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-500 px-5 py-3 font-medium text-white transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm md:col-span-1">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              Student Info
            </h2>

            <div className="space-y-3 text-sm text-slate-700">
              <p>
                <span className="font-semibold">Name:</span> {user?.name}
              </p>
              <p>
                <span className="font-semibold">Role:</span> {user?.role}
              </p>
              <p>
                <span className="font-semibold">Room Number:</span>{" "}
                {user?.roomNumber}
              </p>
              <p>
                <span className="font-semibold">Year:</span> {user?.year}
              </p>
              <p>
                <span className="font-semibold">Registration No:</span>{" "}
                {user?.regNo}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm md:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              Leave Form
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Leave Type
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="day_out">Day Out</option>
                  <option value="out_going">Out Going</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Expected Return Time
                </label>
                <input
                  type="datetime-local"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleLeave}
                disabled={loadingLeave}
                className="rounded-xl bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700 disabled:bg-green-400"
              >
                {loadingLeave ? "Submitting..." : "Submit Leave"}
              </button>

              <button
                onClick={handleReturn}
                disabled={loadingReturn}
                className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loadingReturn ? "Processing..." : "Mark Return"}
              </button>

              <Link to="/history">
                <button className="w-full rounded-xl bg-slate-800 px-5 py-3 font-medium text-white transition hover:bg-slate-900 sm:w-auto">
                  View History
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;