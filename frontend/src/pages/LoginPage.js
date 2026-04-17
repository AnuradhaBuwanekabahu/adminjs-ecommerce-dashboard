import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../services/api";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await request("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (data && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/orders");
      } else {
        throw new Error("Invalid login response");
      }
    } catch (err) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 150px)' }}>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      
      <div className="glass-card fade-in-up" style={{ width: '100%', maxWidth: '400px', 'zIndex': 10 }}>
        <h1 className="text-center" style={{ marginBottom: '0.5rem' }}>Welcome Back</h1>
        <p className="text-center text-secondary" style={{ marginBottom: '2rem' }}>Sign in to continue to TechStore</p>
        
        <form onSubmit={handleLogin}>
          {error && <div className="message error text-center">{error}</div>}
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="email"
              className="input-glass"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="password"
              className="input-glass"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
        
        <p className="text-center mt-2 text-secondary">
          Don't have an account? <Link to="/signup" className="text-gradient hover-underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
