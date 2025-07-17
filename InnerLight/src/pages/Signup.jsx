import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [animate, setAnimate] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation after mount
    setAnimate(true);
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/users/signup", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="d-flex" style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* Left Half */}
      <div
        className={`d-flex justify-content-center align-items-center text-white transition-element ${animate ? "slide-in-left" : ""}`}
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
          <p className="lead">Your path to inner peace starts here 🌿</p>
        </div>
      </div>

      {/* Right Half */}
      <div
        className={`d-flex justify-content-center align-items-center bg-light transition-element ${animate ? "slide-in-right" : ""}`}
        style={{ width: "50%" }}
      >
        <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
          <h3 className="text-center mb-3 text-success">Sign Up</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
                placeholder="Create password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Create Account
            </button>
          </form>
          <p className="mt-3 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none text-success">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
