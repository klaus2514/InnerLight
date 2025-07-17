import { Link } from "react-router-dom";

function Hero() {
  return (
    <div
      className="d-flex align-items-center"
      style={{
        backgroundImage: `url("/home2.jpeg")`, // make sure this matches your actual path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "99vw",
        position: "relative",
      }}
    >
      <div
        className="container text-end text-light"
        style={{
          marginLeft: "00px", // push content to the right
          paddingRight: "0rem",
          maxWidth: "",
          padding: "0rem",
          borderRadius: "12px",
        }}
      >
        <h1
          className="display-4 fw-bold mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Welcome to <span className="text-success">InnerLight</span>
        </h1>
        <p className="lead mb-4">
          A safe space to heal, reflect, and rediscover your inner calm.
        </p>
        <Link to="/signup" className="btn btn-success rounded-pill px-4 py-2">
          Start Your Journey
        </Link>
      </div>
    </div>
  );
}

export default Hero;
