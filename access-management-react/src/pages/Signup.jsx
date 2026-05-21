import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const signup = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:3000/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      alert(data.message || "Response received");

      if (response.ok) {
        navigate("/");
      }
    } catch (e) {
      alert("ERROR: " + e.message);
    }
  };

  return (
    <>
      <header>
        <h1>Access Management System</h1>
      </header>

      <div className="container">
        <div className="card">
          <h2>Create Account</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <select name="role" onChange={handleChange}>
            <option value="EMPLOYEE">Employee</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button onClick={signup}>Signup</button>

          <div className="link">
            Already have an account? <Link to="/">Login</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;