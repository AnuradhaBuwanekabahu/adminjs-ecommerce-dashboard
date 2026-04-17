import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../services/api";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await request("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: `${firstName} ${lastName}`.trim() })
      });
      if (data && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        throw new Error("Invalid signup response");
      }
    } catch (err) {
      setError(err.message || "Failed to signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 150px)' }}>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      
      <div className="glass-card fade-in-up" style={{ width: '100%', maxWidth: '450px', 'zIndex': 10 }}>
        <h1 className="text-center" style={{ marginBottom: '0.5rem' }}>Join TechStore</h1>
        <p className="text-center text-secondary" style={{ marginBottom: '2rem' }}>Create an account to unlock premium gadgets.</p>
        
        <form onSubmit={handleSignup}>
          {error && <div className="message error text-center">{error}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input
              type="text"
              className="input-glass"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              className="input-glass"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div>
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
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        
        <p className="text-center mt-2 text-secondary">
          Already have an account? <Link to="/login" className="text-gradient hover-underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
