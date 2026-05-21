import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function Admin() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);

  const [showRequests, setShowRequests] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const loadUsers = async () => {
    const res = await fetch(
      "http://localhost:3000/requests/admin/users",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const data = await res.json();
    setUsers(data.users);
  };

  const grant = async (id) => {
    await fetch(
      `http://localhost:3000/requests/admin/grant/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    loadUsers();
  };

  const revoke = async (id) => {
    await fetch(
      `http://localhost:3000/requests/admin/revoke/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    loadUsers();
  };

  const loadRequests = async () => {
    const res = await fetch(
      "http://localhost:3000/requests/admin/pending",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const data = await res.json();
    setRequests(data.requests);
  };

  const approve = async (id) => {
    const reply = prompt("Enter reply");

    await fetch(
      `http://localhost:3000/requests/admin/approve/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ reply }),
      }
    );

    loadRequests();
    loadUsers();
  };

  const rejectRequest = async (id) => {
    const reply = prompt("Enter rejection reason");

    await fetch(
      `http://localhost:3000/requests/admin/reject/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ reply }),
      }
    );

    loadRequests();
  };

  const loadHistory = async () => {
    const res = await fetch(
      "http://localhost:3000/requests/admin/history",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const data = await res.json();
    setHistory(data.history);
  };

  return (
    <div className="dashboard">
      <div className="navbar">
        <h2>Admin Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="card">
        <h3>Registered Employees</h3>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.status}</td>

                <td>
                  {user.status === "ACTIVE" ? (
                    <button onClick={() => revoke(user._id)}>
                      Revoke
                    </button>
                  ) : (
                    <button onClick={() => grant(user._id)}>
                      Grant
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Pending Requests</h3>

        <button
          onClick={() => {
            setShowRequests(!showRequests);
            loadRequests();
          }}
        >
          Show Pending Requests
        </button>

        {showRequests && (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((r) => (
                <tr key={r._id}>
                  <td>{r.userId.name}</td>
                  <td>{r.userId.email}</td>
                  <td>{r.reason}</td>

                  <td>
                    <button onClick={() => approve(r._id)}>
                      Approve
                    </button>

                    <button
                      onClick={() => rejectRequest(r._id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3>Access History</h3>

        <button
          onClick={() => {
            setShowHistory(!showHistory);
            loadHistory();
          }}
        >
          Show Access History
        </button>

        {showHistory && (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Status</th>
                <th>Reply</th>
                <th>Admin</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {history.map((h) => (
                <tr key={h._id}>
                  <td>{h.userId.name}</td>
                  <td>{h.userId.email}</td>
                  <td>{h.status}</td>
                  <td>{h.adminReply || "-"}</td>
                  <td>{h.decisionBy?.name || "-"}</td>
                  <td>
                    {new Date(
                      h.decisionDate
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Admin;