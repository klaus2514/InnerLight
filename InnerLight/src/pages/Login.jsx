import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [animate, setAnimate] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });
      
      if (res.data.token) {
        onLogin({
          token: res.data.token,
          id: res.data._id,
          name: res.data.name,
          email: res.data.email
        });
        navigate("/dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="d-flex" style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* Left Static Image Half - EXACTLY as you had it */}
      <div
        className="d-flex justify-content-center align-items-center text-white"
        style={{
          width: "50%",
          backgroundImage: 'url("/signup.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "30px",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <h1
            className="display-3 fw-bold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            InnerLight
          </h1>
          <p className="lead">Welcome back to your wellness journey 🌱</p>
        </div>
      </div>

      {/* Right Animated Form Half - EXACTLY as you had it */}
      <div
        className={`d-flex justify-content-center align-items-center bg-light transition-element ${animate ? "slide-in-right" : ""}`}
        style={{ width: "50%" }}
      >
        <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
          <h3 className="text-center mb-3 text-success">Log In</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Log In
            </button>
          </form>
          <p className="mt-3 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-decoration-none text-success">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;