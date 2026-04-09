import React, { useEffect, useState } from "react";
import API from "../services/api";

function WardenDashboard() {
  const [currentOut, setCurrentOut] = useState([]);
  const [late, setLate] = useState([]);

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
    }
  };

  return (
    <div className="dashboard">
      <h2>Warden Dashboard</h2>

      <div className="card">
        <h3>Students Currently Out</h3>
        <table className="history-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Room</th>
              <th>Leave Type</th>
              <th>Leave Time</th>
            </tr>
          </thead>
          <tbody>
            {currentOut.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.roomNumber}</td>
                <td>{item.leaveType}</td>
                <td>{new Date(item.leaveDateTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Late Returns</h3>
        <table className="history-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Room</th>
              <th>Return Time</th>
            </tr>
          </thead>
          <tbody>
            {late.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.roomNumber}</td>
                <td>{new Date(item.returnDateTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WardenDashboard;