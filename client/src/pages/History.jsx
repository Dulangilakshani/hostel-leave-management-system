import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function History() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/leave/my-history");
      setLeaves(res.data);
    } catch (error) {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">My Leave History</h1>
            <p className="mt-1 text-sm text-slate-500">
              View all your past leave and return records
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/dashboard">
              <button className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700">
                Back to Dashboard
              </button>
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-red-500 px-5 py-3 font-medium text-white transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {loading ? (
            <div className="p-6 text-slate-600">Loading history...</div>
          ) : leaves.length === 0 ? (
            <div className="p-6 text-slate-600">No leave records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-800 text-white">
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
                      className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className="px-4 py-3">
                        {formatLeaveType(leave.leaveType)}
                      </td>
                      <td className="px-4 py-3">
                        {formatDateTime(leave.leaveDateTime)}
                      </td>
                      <td className="px-4 py-3">
                        {formatDateTime(leave.expectedReturnDateTime)}
                      </td>
                      <td className="px-4 py-3">
                        {formatDateTime(leave.returnDateTime)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            leave.status === "on_time"
                              ? "bg-green-100 text-green-700"
                              : leave.status === "late"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {leave.status}
                        </span>
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
  );
}

export default History;