import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaChartPie,
  FaArrowLeft,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaDownload,
} from "react-icons/fa";

function Reports() {
  const [summary, setSummary] = useState({
    total: 0,
    late: 0,
    onTime: 0,
    pending: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const navigate = useNavigate();

  const COLORS = ["#ef4444", "#22c55e", "#eab308", "#3b82f6"];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const [summaryRes, monthlyRes, statusRes] = await Promise.all([
        API.get("/leave/report"),
        API.get("/leave/monthly-report"),
        API.get("/leave/status-chart"),
      ]);

      setSummary(summaryRes.data);
      setMonthlyData(monthlyRes.data);
      setStatusData(statusRes.data);
    } catch (error) {
      console.log("REPORT PAGE ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/warden");
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

  const handleDownload = () => {
    try {
      const pdf = new jsPDF();

      let y = 10;

      pdf.setFontSize(18);
      pdf.text("Hostel Leave Report", 10, y);

      y += 10;

      pdf.setFontSize(12);
      pdf.text(`Total Leaves: ${summary.total}`, 10, y);
      y += 8;

      pdf.text(`Late Returns: ${summary.late}`, 10, y);
      y += 8;

      pdf.text(`On Time Returns: ${summary.onTime}`, 10, y);
      y += 8;

      pdf.text(`Pending Leaves: ${summary.pending}`, 10, y);

      y += 12;

      pdf.setFontSize(14);
      pdf.text("Monthly Report", 10, y);

      y += 8;

      pdf.setFontSize(10);
      pdf.text("Month | Total | Late | OnTime | Pending", 10, y);

      y += 6;

      monthlyData.forEach((item) => {
        const row = `${item.month} | ${item.totalLeaves} | ${item.lateReturns} | ${item.onTimeReturns} | ${item.pendingLeaves}`;
        pdf.text(row, 10, y);

        y += 6;

        if (y > 280) {
          pdf.addPage();
          y = 10;
        }
      });

      pdf.save("hostel-report.pdf");
    } catch (error) {
      console.log("PDF ERROR:", error);
      alert("Download failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* HEADER */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-slate-700 dark:to-slate-900 text-white shadow-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FaChartPie />
              Reports Dashboard
            </h1>
            <p className="mt-1 text-sm opacity-90">
              Analytics and charts for hostel leave management
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
              onClick={handleBack}
              className="bg-blue-500 px-4 py-2 rounded-xl hover:bg-blue-600 transition flex items-center gap-2"
            >
              <FaArrowLeft />
              Back
            </button>

            <button
              onClick={handleDownload}
              className="bg-green-500 px-4 py-2 rounded-xl hover:bg-green-600 transition flex items-center gap-2"
            >
              <FaDownload />
              Download PDF
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

        {loading ? (
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-md text-slate-600 dark:text-slate-300">
            Loading reports...
          </div>
        ) : (
          <div id="report-content">
            {/* SUMMARY CARDS */}
            <div className="mb-6 grid gap-6 md:grid-cols-4">
              <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-md hover:shadow-xl transition">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Total Leaves
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
                  {summary.total}
                </h2>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-md hover:shadow-xl transition">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Late Returns
                </p>
                <h2 className="mt-2 text-3xl font-bold text-red-600">
                  {summary.late}
                </h2>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-md hover:shadow-xl transition">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  On Time
                </p>
                <h2 className="mt-2 text-3xl font-bold text-green-600">
                  {summary.onTime}
                </h2>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-md hover:shadow-xl transition">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Pending
                </p>
                <h2 className="mt-2 text-3xl font-bold text-yellow-600">
                  {summary.pending}
                </h2>
              </div>
            </div>

            {/* CHARTS */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-md">
                <h3 className="mb-4 text-xl font-semibold text-slate-800 dark:text-white">
                  Monthly Leave Report
                </h3>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="totalLeaves" fill="#3b82f6" name="Total" />
                      <Bar dataKey="lateReturns" fill="#ef4444" name="Late" />
                      <Bar dataKey="onTimeReturns" fill="#22c55e" name="On Time" />
                      <Bar dataKey="pendingLeaves" fill="#eab308" name="Pending" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-md">
                <h3 className="mb-4 text-xl font-semibold text-slate-800 dark:text-white">
                  Leave Status Distribution
                </h3>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        dataKey="value"
                        nameKey="name"
                        label
                      >
                        {statusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="mt-6 overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-md">
              <div className="border-b border-slate-200 dark:border-slate-700 p-5">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                  Monthly Report Table
                </h3>
              </div>

              {monthlyData.length === 0 ? (
                <div className="p-5 text-slate-600 dark:text-slate-300">
                  No monthly report data available.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-800 dark:bg-slate-700 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left">Month</th>
                        <th className="px-4 py-3 text-left">Total Leaves</th>
                        <th className="px-4 py-3 text-left">Late Returns</th>
                        <th className="px-4 py-3 text-left">On Time</th>
                        <th className="px-4 py-3 text-left">Pending</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyData.map((item, index) => (
                        <tr
                          key={item.month}
                          className={`border-b border-slate-200 dark:border-slate-700 ${
                            index % 2 === 0
                              ? "bg-white dark:bg-slate-900"
                              : "bg-slate-50 dark:bg-slate-800"
                          } hover:bg-slate-100 dark:hover:bg-slate-700 transition`}
                        >
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                            {item.month}
                          </td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                            {item.totalLeaves}
                          </td>
                          <td className="px-4 py-3 text-red-600 font-semibold">
                            {item.lateReturns}
                          </td>
                          <td className="px-4 py-3 text-green-600 font-semibold">
                            {item.onTimeReturns}
                          </td>
                          <td className="px-4 py-3 text-yellow-600 font-semibold">
                            {item.pendingLeaves}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;