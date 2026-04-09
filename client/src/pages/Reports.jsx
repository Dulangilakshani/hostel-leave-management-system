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

  const handleDownload = () => {
  try {
    const pdf = new jsPDF();

    let y = 10;

    // Title
    pdf.setFontSize(18);
    pdf.text("Hostel Leave Report", 10, y);

    y += 10;

    // Summary
    pdf.setFontSize(12);
    pdf.text(`Total Leaves: ${summary.total}`, 10, y);
    y += 8;

    pdf.text(`Late Returns: ${summary.late}`, 10, y);
    y += 8;

    pdf.text(`On Time Returns: ${summary.onTime}`, 10, y);
    y += 8;

    pdf.text(`Pending Leaves: ${summary.pending}`, 10, y);

    y += 12;

    // Table Header
    pdf.setFontSize(14);
    pdf.text("Monthly Report", 10, y);

    y += 8;

    pdf.setFontSize(10);
    pdf.text("Month | Total | Late | OnTime | Pending", 10, y);

    y += 6;

    // Table Data
    monthlyData.forEach((item) => {
      const row = `${item.month} | ${item.totalLeaves} | ${item.lateReturns} | ${item.onTimeReturns} | ${item.pendingLeaves}`;
      pdf.text(row, 10, y);

      y += 6;

      // new page if overflow
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
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Reports Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Analytics and charts for hostel leave management
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleBack}
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Back to Warden
            </button>

            <button
              onClick={handleDownload}
              className="rounded-xl bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700"
            >
              Download PDF
            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-red-500 px-5 py-3 font-medium text-white transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm text-slate-600">
            Loading reports...
          </div>
        ) : (
          <div id="report-content">
            <div className="mb-6 grid gap-6 md:grid-cols-4">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Total Leaves</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {summary.total}
                </h2>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Late Returns</p>
                <h2 className="mt-2 text-3xl font-bold text-red-600">
                  {summary.late}
                </h2>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">On Time</p>
                <h2 className="mt-2 text-3xl font-bold text-green-600">
                  {summary.onTime}
                </h2>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Pending</p>
                <h2 className="mt-2 text-3xl font-bold text-yellow-600">
                  {summary.pending}
                </h2>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-slate-800">
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
                      <Bar
                        dataKey="onTimeReturns"
                        fill="#22c55e"
                        name="On Time"
                      />
                      <Bar
                        dataKey="pendingLeaves"
                        fill="#eab308"
                        name="Pending"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-slate-800">
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

            <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5">
                <h3 className="text-xl font-semibold text-slate-800">
                  Monthly Report Table
                </h3>
              </div>

              {monthlyData.length === 0 ? (
                <div className="p-5 text-slate-600">
                  No monthly report data available.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-800 text-white">
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
                          className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                        >
                          <td className="px-4 py-3">{item.month}</td>
                          <td className="px-4 py-3">{item.totalLeaves}</td>
                          <td className="px-4 py-3">{item.lateReturns}</td>
                          <td className="px-4 py-3">{item.onTimeReturns}</td>
                          <td className="px-4 py-3">{item.pendingLeaves}</td>
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