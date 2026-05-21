import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function Employee() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [status, setStatus] = useState("Loading...");
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      loadStatus();
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const loadStatus = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/requests/status",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (res.status === 401) {
        logout();
        return;
      }

      const data = await res.json();
      setStatus(data.status);
    } catch (err) {
      alert("Failed to load status");
    }
  };

  const submitRequest = async () => {
    if (!reason.trim()) {
      setMessage("Reason is required");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/requests/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ reason }),
        }
      );

      const data = await res.json();

      setMessage(data.message);

      if (res.ok) {
        setReason("");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  const loadMyRequests = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/requests/my-requests",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await res.json();
      setRequests(data.requests);
    } catch (err) {
      alert("Failed to load requests");
    }
  };

  return (
    <div className="dashboard">
      <div className="navbar">
        <h2>Employee Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="card">
        <h3>Your Access Status</h3>
        <p>{status}</p>
      </div>

      {status !== "REVOKED" && (
        <div className="card">
          <h3>Create Request</h3>

          <button onClick={() => setShowForm(!showForm)}>
            Create Request
          </button>

          {showForm && (
            <div style={{ marginTop: "15px" }}>
              <label>Reason</label>

              <textarea
                rows="4"
                placeholder="Enter reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />

              <button onClick={submitRequest}>Submit</button>

              <p>{message}</p>
            </div>
          )}
        </div>
      )}

      <div className="card">
        <h3>My Requests</h3>

        <button onClick={loadMyRequests}>
          Show Requests
        </button>

        <div style={{ marginTop: "15px" }}>
          {requests.length === 0 ? (
            <p>No requests found</p>
          ) : (
            requests.map((req) => (
              <div
                key={req._id}
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                }}
              >
                <p>
                  <strong>Reason:</strong> {req.reason}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span>
                    {req.status}
                  </span>
                </p>

                <p>
                  <strong>Admin Reply:</strong>{" "}
                  {req.adminReply || "No reply yet"}
                </p>

                <p>
                  <strong>Submitted On:</strong>{" "}
                  {new Date(req.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Employee;