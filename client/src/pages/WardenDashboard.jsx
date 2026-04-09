import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

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
      console.log("WARDEN DASHBOARD ERROR:", error.response?.data || error.message);
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

  const formatLeaveType = (leaveType) => {
    if (leaveType === "day_out") return "Day Out";
    if (leaveType === "out_going") return "Out Going";
    return leaveType;
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Warden Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Welcome, {user?.name}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-500 px-5 py-3 font-medium text-white transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Leaves</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {report.total}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Late Returns</p>
            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {report.late}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">On Time</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {report.onTime}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Pending</p>
            <h2 className="mt-2 text-3xl font-bold text-yellow-600">
              {report.pending}
            </h2>
          </div>
        </div>

        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold text-slate-800">Filters</h3>

          <div className="grid gap-4 md:grid-cols-3">
            <input
              type="text"
              placeholder="Year (2025)"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <input
              type="text"
              placeholder="Room Number (A101)"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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

        <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h3 className="text-xl font-semibold text-slate-800">
              Filtered Results
            </h3>
          </div>

          {filtered.length === 0 ? (
            <div className="p-5 text-slate-600">No filtered results yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-800 text-white">
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
                      className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3">{item.roomNumber}</td>
                      <td className="px-4 py-3">{formatLeaveType(item.leaveType)}</td>
                      <td className="px-4 py-3">{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h3 className="text-xl font-semibold text-slate-800">
                Students Currently Out
              </h3>
            </div>

            {loading ? (
              <div className="p-5 text-slate-600">Loading...</div>
            ) : currentOut.length === 0 ? (
              <div className="p-5 text-slate-600">No students currently out.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-800 text-white">
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
                        className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3">{item.roomNumber}</td>
                        <td className="px-4 py-3">{formatLeaveType(item.leaveType)}</td>
                        <td className="px-4 py-3">
                          {new Date(item.leaveDateTime).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h3 className="text-xl font-semibold text-slate-800">
                Late Returns
              </h3>
            </div>

            {loading ? (
              <div className="p-5 text-slate-600">Loading...</div>
            ) : late.length === 0 ? (
              <div className="p-5 text-slate-600">No late returns found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-800 text-white">
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
                        className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3">{item.roomNumber}</td>
                        <td className="px-4 py-3">
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