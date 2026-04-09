import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function WardenDashboard() {
  const [currentOut, setCurrentOut] = useState([]);
  const [late, setLate] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const outRes = await API.get("/leave/current-out");
      const lateRes = await API.get("/leave/late");

      setCurrentOut(outRes.data);
      setLate(lateRes.data);
    } catch (error) {
      alert(error.response?.data?.message || "Error loading data");
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-3xl font-bold text-slate-800">
              Warden Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor student leave activity in real time
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-700">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-red-500 px-5 py-3 font-medium text-white transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Students Currently Out</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {currentOut.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Late Returns</p>
            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {late.length}
            </h2>
          </div>
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
                        <td className="px-4 py-3">
                          {formatLeaveType(item.leaveType)}
                        </td>
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