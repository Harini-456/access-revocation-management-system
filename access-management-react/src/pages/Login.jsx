import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showRequestBtn, setShowRequestBtn] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const login = async () => {
    const { email, password } = formData;

    if (!email && !password) {
      setError("Email and Password are required");
      return;
    }

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        if (data.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/employee");
        }
      } else {
        setError(data.message);

        if (data.message.includes("revoked")) {
          setShowRequestBtn(true);
        } else {
          setShowRequestBtn(false);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <header>
        <h1>Access Management System</h1>
      </header>

      <div className="container">
        <div className="card">
          <h2>Login</h2>

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

          <button onClick={login}>Login</button>

          <div className="link">
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </div>

          {error && (
            <div className="error-box">
              <p>{error}</p>

              {showRequestBtn && (
                <button onClick={() => navigate("/request")}>
                  Request Access
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;