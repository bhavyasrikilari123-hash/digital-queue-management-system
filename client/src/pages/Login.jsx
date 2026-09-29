import { useState } from "react";
import { loginUser } from "../services/api";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ==============================
  // LOGIN
  // ==============================

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      // Save JWT token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Save user information
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      if (onLogin) {
        onLogin(data);
      }
    } catch (error) {
      setMessage(
        error.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* LEFT SIDE */}

      <div style={styles.leftPanel}>

        <div style={styles.brand}>
          <div style={styles.logoBox}>Q</div>

          <div>
            <h1 style={styles.brandTitle}>
              Digital Queue
            </h1>

            <p style={styles.brandSubTitle}>
              Smart Queue Management System
            </p>
          </div>
        </div>

        <div style={styles.heroContent}>

          <div style={styles.iconCircle}>
            🎟️
          </div>

          <h2 style={styles.heroTitle}>
            Skip the Wait.
            <br />
            Manage Your Queue.
          </h2>

          <p style={styles.heroText}>
            A simple digital queue management system
            designed to make customer service faster,
            smarter and more organized.
          </p>

          <div style={styles.featureList}>

            <div style={styles.feature}>
              <span>✓</span>
              Easy token generation
            </div>

            <div style={styles.feature}>
              <span>✓</span>
              Real-time queue tracking
            </div>

            <div style={styles.feature}>
              <span>✓</span>
              Simple admin management
            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div style={styles.rightPanel}>

        <div style={styles.loginCard}>

          <div style={styles.mobileLogo}>
            Q
          </div>

          <h2 style={styles.loginTitle}>
            Welcome Back
          </h2>

          <p style={styles.loginSubtitle}>
            Login to continue to your dashboard
          </p>

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <label style={styles.label}>
              Email Address
            </label>

            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>
                ✉
              </span>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                style={styles.input}
              />
            </div>

            {/* ERROR */}

            {message && (
              <div style={styles.error}>
                ⚠ {message}
              </div>
            )}

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.loginButton,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Signing in..."
                : "Sign In →"}
            </button>

          </form>

          {/* REGISTER */}

          <div style={styles.registerSection}>

            <p style={styles.registerText}>
              Don't have an account?
            </p>

            <button
              type="button"
              onClick={onRegister}
              style={styles.registerButton}
            >
              Create New Account
            </button>

          </div>

          <p style={styles.footerText}>
            Secure Digital Queue Management
          </p>

        </div>

      </div>

    </div>
  );
}

// ======================================
// STYLES
// ======================================

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "#f8fafc",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  // ==============================
  // LEFT PANEL
  // ==============================

  leftPanel: {
    width: "48%",
    minHeight: "100vh",
    background:
      "linear-gradient(145deg, #172554, #1e3a8a, #2563eb)",
    color: "white",
    padding: "55px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  logoBox: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.15)",
    border:
      "1px solid rgba(255,255,255,0.25)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "25px",
    fontWeight: "bold",
  },

  brandTitle: {
    margin: 0,
    fontSize: "24px",
  },

  brandSubTitle: {
    margin: "4px 0 0",
    color: "#bfdbfe",
    fontSize: "13px",
  },

  heroContent: {
    maxWidth: "520px",
    margin: "auto 0",
  },

  iconCircle: {
    width: "70px",
    height: "70px",
    borderRadius: "20px",
    background:
      "rgba(255,255,255,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    marginBottom: "25px",
  },

  heroTitle: {
    fontSize: "42px",
    lineHeight: "1.15",
    margin: "0 0 20px",
  },

  heroText: {
    color: "#dbeafe",
    lineHeight: "1.7",
    fontSize: "16px",
    maxWidth: "480px",
  },

  featureList: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#eff6ff",
    fontSize: "15px",
  },

  // ==============================
  // RIGHT PANEL
  // ==============================

  rightPanel: {
    flex: 1,
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    boxSizing: "border-box",
  },

  loginCard: {
    width: "100%",
    maxWidth: "430px",
    background: "white",
    padding: "42px",
    borderRadius: "20px",
    boxShadow:
      "0 20px 50px rgba(15,23,42,0.10)",
    boxSizing: "border-box",
  },

  mobileLogo: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    background: "#dbeafe",
    color: "#1d4ed8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },

  loginTitle: {
    margin: 0,
    color: "#172554",
    fontSize: "30px",
  },

  loginSubtitle: {
    margin:
      "8px 0 30px",
    color: "#64748b",
    fontSize: "14px",
  },

  label: {
    display: "block",
    color: "#334155",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "8px",
    marginTop: "18px",
  },

  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border:
      "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "#f8fafc",
    padding: "0 13px",
  },

  inputIcon: {
    fontSize: "16px",
    marginRight: "10px",
  },

  input: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "14px 5px",
    fontSize: "15px",
    color: "#0f172a",
    boxSizing: "border-box",
  },

  error: {
    marginTop: "15px",
    padding: "11px",
    borderRadius: "8px",
    background: "#fef2f2",
    color: "#dc2626",
    fontSize: "13px",
  },

  loginButton: {
    width: "100%",
    marginTop: "25px",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #1d4ed8, #2563eb)",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow:
      "0 8px 20px rgba(37,99,235,0.25)",
  },

  registerSection: {
    marginTop: "28px",
    paddingTop: "25px",
    borderTop:
      "1px solid #e2e8f0",
    textAlign: "center",
  },

  registerText: {
    margin: "0 0 12px",
    color: "#64748b",
    fontSize: "14px",
  },

  registerButton: {
    width: "100%",
    padding: "12px",
    border:
      "1px solid #2563eb",
    borderRadius: "9px",
    background: "white",
    color: "#1d4ed8",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  footerText: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "11px",
    marginTop: "25px",
  },
};

export default Login;