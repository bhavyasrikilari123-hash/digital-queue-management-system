import { useState } from "react";
import { registerUser } from "../services/api";

function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name,
        email,
        password,
      });

      setMessage("Account created successfully!");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        if (onRegister) {
          onRegister();
        }
      }, 1200);
    } catch (error) {
      setError(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* LEFT SIDE */}

      <div style={styles.leftPanel}>
        <div style={styles.logoBox}>Q</div>

        <h1 style={styles.brand}>
          Digital Queue
        </h1>

        <p style={styles.brandSub}>
          Smart Queue Management System
        </p>

        <div style={styles.iconBox}>
          ✨
        </div>

        <h2 style={styles.mainTitle}>
          Join the Queue.
          <br />
          Save Your Time.
        </h2>

        <p style={styles.description}>
          Create your account and experience
          faster, smarter and more organized
          customer service.
        </p>

        <div style={styles.features}>

          <div style={styles.feature}>
            <span>✓</span>
            <p>Quick account registration</p>
          </div>

          <div style={styles.feature}>
            <span>✓</span>
            <p>Easy token generation</p>
          </div>

          <div style={styles.feature}>
            <span>✓</span>
            <p>Track your queue status</p>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}

      <div style={styles.rightPanel}>

        <div style={styles.card}>

          <div style={styles.smallLogo}>
            Q
          </div>

          <h1 style={styles.title}>
            Create Account
          </h1>

          <p style={styles.subtitle}>
            Register to start using Digital Queue
          </p>

          <form onSubmit={handleRegister}>

            {/* NAME */}

            <label style={styles.label}>
              Full Name
            </label>

            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>
                👤
              </span>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                style={styles.input}
              />
            </div>

            {/* EMAIL */}

            <label style={styles.label}>
              Email Address
            </label>

            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>
                ✉️
              </span>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                style={styles.input}
              />
            </div>

            {/* PASSWORD */}

            <label style={styles.label}>
              Password
            </label>

            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>
                🔒
              </span>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                style={styles.input}
              />
            </div>

            {/* CONFIRM PASSWORD */}

            <label style={styles.label}>
              Confirm Password
            </label>

            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>
                🔐
              </span>

              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                style={styles.input}
              />
            </div>

            {/* ERROR */}

            {error && (
              <div style={styles.error}>
                ⚠ {error}
              </div>
            )}

            {/* SUCCESS */}

            {message && (
              <div style={styles.success}>
                ✓ {message}
              </div>
            )}

            {/* REGISTER BUTTON */}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.registerButton,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Creating Account..."
                : "Create Account →"}
            </button>

          </form>

          {/* LOGIN */}

          <div style={styles.loginSection}>

            <p style={styles.loginText}>
              Already have an account?
            </p>

            <button
              type="button"
              onClick={onRegister}
              style={styles.loginButton}
            >
              ← Back to Login
            </button>

          </div>

          <p style={styles.footer}>
            Secure Digital Queue Management
          </p>

        </div>

      </div>

    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "#f8fafc",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  // LEFT PANEL

  leftPanel: {
    width: "46%",
    minHeight: "100vh",
    background:
      "linear-gradient(145deg, #172554, #1d4ed8, #2563eb)",
    color: "white",
    padding: "45px 55px",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
  },

  logoBox: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background:
      "rgba(255,255,255,0.15)",
    border:
      "1px solid rgba(255,255,255,0.25)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "25px",
    fontWeight: "bold",
    marginBottom: "12px",
  },

  brand: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
  },

  brandSub: {
    marginTop: "6px",
    color: "#dbeafe",
    fontSize: "14px",
  },

  iconBox: {
    marginTop: "95px",
    width: "62px",
    height: "62px",
    borderRadius: "18px",
    background:
      "rgba(255,255,255,0.13)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "27px",
  },

  mainTitle: {
    fontSize: "43px",
    lineHeight: "1.15",
    marginTop: "35px",
    marginBottom: "22px",
  },

  description: {
    maxWidth: "500px",
    color: "#dbeafe",
    fontSize: "16px",
    lineHeight: "1.7",
  },

  features: {
    marginTop: "35px",
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "17px",
  },

  // RIGHT PANEL

  rightPanel: {
    width: "54%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "35px",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "510px",
    background: "white",
    padding: "35px 45px",
    borderRadius: "22px",
    boxShadow:
      "0 15px 45px rgba(15,23,42,0.10)",
    boxSizing: "border-box",
  },

  smallLogo: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "23px",
    fontWeight: "bold",
    margin: "0 auto 18px",
  },

  title: {
    textAlign: "center",
    margin: 0,
    color: "#172554",
    fontSize: "31px",
  },

  subtitle: {
    textAlign: "center",
    color: "#64748b",
    marginTop: "9px",
    marginBottom: "28px",
    fontSize: "14px",
  },

  label: {
    display: "block",
    color: "#334155",
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "7px",
    marginTop: "15px",
  },

  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "#ffffff",
    overflow: "hidden",
  },

  inputIcon: {
    width: "45px",
    textAlign: "center",
    fontSize: "15px",
  },

  input: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "13px 10px 13px 0",
    fontSize: "15px",
    color: "#172554",
    background: "transparent",
  },

  error: {
    marginTop: "15px",
    padding: "11px 13px",
    borderRadius: "8px",
    background: "#fef2f2",
    color: "#dc2626",
    fontSize: "13px",
  },

  success: {
    marginTop: "15px",
    padding: "11px 13px",
    borderRadius: "8px",
    background: "#f0fdf4",
    color: "#16a34a",
    fontSize: "13px",
  },

  registerButton: {
    width: "100%",
    marginTop: "22px",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background:
      "linear-gradient(90deg, #2563eb, #1d4ed8)",
    color: "white",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },

  loginSection: {
    textAlign: "center",
    marginTop: "23px",
    paddingTop: "20px",
    borderTop: "1px solid #e2e8f0",
  },

  loginText: {
    margin: "0 0 10px",
    color: "#64748b",
    fontSize: "14px",
  },

  loginButton: {
    width: "100%",
    padding: "11px",
    border: "1px solid #2563eb",
    borderRadius: "9px",
    background: "white",
    color: "#1d4ed8",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  footer: {
    textAlign: "center",
    marginTop: "20px",
    marginBottom: 0,
    color: "#94a3b8",
    fontSize: "11px",
  },
};

export default Register;