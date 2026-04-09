import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function History() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/leave/my-history");
      setLeaves(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load history");
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "-";
    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="dashboard">
      <div className="card">
        <h2>My Leave History</h2>
        <Link to="/dashboard">
          <button style={{ marginTop: "10px", marginBottom: "10px" }}>
            Back to Dashboard
          </button>
        </Link>

        {leaves.length === 0 ? (
          <p>No leave records found.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Leave Time</th>
                <th>Expected Return</th>
                <th>Return Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td>
  {leave.leaveType === "day_out" ? "Day Out" : "Out Going"}
</td>
                  <td>{formatDateTime(leave.leaveDateTime)}</td>
                  <td>{formatDateTime(leave.expectedReturnDateTime)}</td>
                  <td>{formatDateTime(leave.returnDateTime)}</td>
                  <td>{leave.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default History;