import React, { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [leaveType, setLeaveType] = useState("day_out");
  const [returnTime, setReturnTime] = useState("");

  const handleLeave = async () => {
    try {
      const res = await API.post("/leave/create", {
        leaveType,
        expectedReturnDateTime: returnTime,
      });

      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Leave failed");
    }
  };

  const handleReturn = async () => {
    try {
      const res = await API.put("/leave/return");
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Return failed");
    }
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="card">
        <p><b>Name:</b> {user?.name}</p>
        <p><b>Room:</b> {user?.roomNumber}</p>
        <p><b>Role:</b> {user?.role}</p>
      </div>

      <div className="card">
        <h3>Leave Form</h3>

        <label>Leave Type</label>
        <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
          <option value="day_out">Day Out</option>
          <option value="out_going">Out Going</option>
        </select>

        <label>Expected Return Time</label>
        <input
          type="datetime-local"
          value={returnTime}
          onChange={(e) => setReturnTime(e.target.value)}
        />

        <button onClick={handleLeave}>Submit Leave</button>
      </div>

      <div className="card">
        <h3>Return</h3>
        <button onClick={handleReturn}>Mark Return</button>
      </div>

      <div className="card">
        <h3>History</h3>
        <Link to="/history">
          <button>View My History</button>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;