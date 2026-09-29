import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";

import {
  getQueue,
  getMyTokens,
  createQueueToken,
} from "./services/api";

function App() {
  // ==========================================
  // AUTH
  // ==========================================

  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const [showRegister, setShowRegister] = useState(false);

  // ==========================================
  // USER
  // ==========================================

  const getStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return null;
    }
  };

  const user = getStoredUser();

  // ==========================================
  // DASHBOARD DATA
  // ==========================================

  const [queue, setQueue] = useState([]);
  const [myTokens, setMyTokens] = useState([]);

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [message, setMessage] = useState("");

  // ==========================================
  // FORM
  // ==========================================

  const [customerName, setCustomerName] = useState("");
  const [service, setService] = useState("");

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [queueData, tokenData] = await Promise.all([
        getQueue(),
        getMyTokens(),
      ]);

      const allQueue = Array.isArray(queueData)
        ? queueData
        : queueData?.queue || [];

      const userTokens = Array.isArray(tokenData)
        ? tokenData
        : tokenData?.tokens || tokenData?.queue || [];

      setQueue(allQueue);
      setMyTokens(userTokens);

      setMessage("");
    } catch (error) {
      console.error("Dashboard loading error:", error);

      setMessage(
        error.message || "Unable to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD AFTER LOGIN
  // ==========================================

  useEffect(() => {
    if (loggedIn && user?.role !== "admin") {
      loadDashboard();
    }
  }, [loggedIn]);

  // ==========================================
  // AUTO REFRESH
  // ==========================================

  useEffect(() => {
    if (!loggedIn || user?.role === "admin") {
      return;
    }

    const interval = setInterval(() => {
      loadDashboard();
    }, 5000);

    return () => clearInterval(interval);
  }, [loggedIn]);

  // ==========================================
  // CREATE TOKEN
  // ==========================================

  const handleCreateToken = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!customerName.trim()) {
      setMessage("Please enter customer name");
      return;
    }

    if (!service) {
      setMessage("Please select a service");
      return;
    }

    try {
      setCreating(true);

      const data = await createQueueToken({
        customerName: customerName.trim(),
        service,
      });

      setMessage(
        data?.message || "Token generated successfully!"
      );

      setCustomerName("");
      setService("");

      await loadDashboard();
    } catch (error) {
      console.error("Create token error:", error);

      setMessage(
        error.message || "Failed to generate token"
      );
    } finally {
      setCreating(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setLoggedIn(false);
    setShowRegister(false);

    setQueue([]);
    setMyTokens([]);

    setCustomerName("");
    setService("");
    setMessage("");
  };

  // ==========================================
  // REGISTER
  // ==========================================

  if (!loggedIn && showRegister) {
    return (
      <Register
        onRegister={() => {
          setShowRegister(false);
        }}
      />
    );
  }

  // ==========================================
  // LOGIN
  // ==========================================

  if (!loggedIn) {
    return (
      <Login
        onLogin={() => {
          setLoggedIn(true);
          setShowRegister(false);
        }}
        onRegister={() => {
          setShowRegister(true);
        }}
      />
    );
  }

  // ==========================================
  // ADMIN DASHBOARD
  // ==========================================

  if (user?.role === "admin") {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // ==========================================
  // LATEST TOKEN
  // ==========================================

  const latestToken =
    myTokens.length > 0 ? myTokens[0] : null;

  // ==========================================
  // QUEUE COUNTS
  // ==========================================

  const waitingCount = queue.filter(
    (item) => item.status === "waiting"
  ).length;

  const servingCount = queue.filter(
    (item) => item.status === "serving"
  ).length;

  // ==========================================
  // QUEUE POSITION
  // ==========================================

  let peopleAhead = 0;
  let queuePosition = "-";
  let estimatedWait = "-";

  if (
    latestToken &&
    (latestToken.status === "waiting" ||
      latestToken.status === "serving")
  ) {
    peopleAhead = queue.filter(
      (item) =>
        item.tokenNumber < latestToken.tokenNumber &&
        (item.status === "waiting" ||
          item.status === "serving")
    ).length;

    queuePosition = peopleAhead + 1;

    estimatedWait =
      latestToken.status === "serving"
        ? "0 min"
        : `${peopleAhead * 5} min`;
  }

  // ==========================================
  // USER DASHBOARD
  // ==========================================

  return (
    <div style={styles.dashboard}>

      {/* NAVBAR */}

      <header style={styles.navbar}>
        <div style={styles.brandSection}>
          <div style={styles.logo}>Q</div>

          <div>
            <h1 style={styles.brandTitle}>
              Digital Queue
            </h1>

            <p style={styles.brandSubTitle}>
              User Dashboard
            </p>
          </div>
        </div>

        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <strong>
              {user?.name || "User"}
            </strong>

            <span>
              {user?.email || ""}
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN */}

      <main style={styles.main}>

        {/* WELCOME */}

        <section style={styles.welcomeSection}>
          <div>
            <p style={styles.smallText}>
              Welcome back 👋
            </p>

            <h2 style={styles.welcomeTitle}>
              {user?.name || "User"}
            </h2>

            <p style={styles.welcomeDescription}>
              Manage your queue tokens and track your
              position easily.
            </p>
          </div>

          <button
            onClick={loadDashboard}
            disabled={loading}
            style={{
              ...styles.refreshButton,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>
        </section>

        {/* MESSAGE */}

        {message && (
          <div style={styles.message}>
            <span>ℹ️</span>
            <span>{message}</span>
          </div>
        )}

        {/* STATS */}

        <section style={styles.statsGrid}>

          <div
            style={{
              ...styles.statCard,
              borderTop: "4px solid #2563eb",
            }}
          >
            <div style={styles.statIconBlue}>🎫</div>

            <div>
              <p style={styles.statLabel}>
                My Tokens
              </p>

              <h3 style={styles.statNumber}>
                {myTokens.length}
              </h3>
            </div>
          </div>

          <div
            style={{
              ...styles.statCard,
              borderTop: "4px solid #f59e0b",
            }}
          >
            <div style={styles.statIconYellow}>⏳</div>

            <div>
              <p style={styles.statLabel}>
                Waiting
              </p>

              <h3 style={styles.statNumber}>
                {waitingCount}
              </h3>
            </div>
          </div>

          <div
            style={{
              ...styles.statCard,
              borderTop: "4px solid #10b981",
            }}
          >
            <div style={styles.statIconGreen}>▶</div>

            <div>
              <p style={styles.statLabel}>
                Currently Serving
              </p>

              <h3 style={styles.statNumber}>
                {servingCount}
              </h3>
            </div>
          </div>

          <div
            style={{
              ...styles.statCard,
              borderTop: "4px solid #8b5cf6",
            }}
          >
            <div style={styles.statIconPurple}>#</div>

            <div>
              <p style={styles.statLabel}>
                Latest Token
              </p>

              <h3 style={styles.statNumber}>
                {latestToken
                  ? `#${latestToken.tokenNumber}`
                  : "-"}
              </h3>
            </div>
          </div>

        </section>

        {/* POSITION */}

        <section style={styles.positionGrid}>

          <div style={styles.positionCard}>
            <div style={styles.positionIcon}>📍</div>

            <div>
              <p style={styles.positionLabel}>
                Your Queue Position
              </p>

              <h2 style={styles.positionNumber}>
                {queuePosition === "-"
                  ? "-"
                  : `#${queuePosition}`}
              </h2>
            </div>
          </div>

          <div style={styles.positionCard}>
            <div style={styles.positionIconYellow}>
              👥
            </div>

            <div>
              <p style={styles.positionLabel}>
                People Ahead
              </p>

              <h2 style={styles.positionNumber}>
                {latestToken &&
                (latestToken.status === "waiting" ||
                  latestToken.status === "serving")
                  ? peopleAhead
                  : "-"}
              </h2>
            </div>
          </div>

          <div style={styles.positionCard}>
            <div style={styles.positionIconGreen}>
              ⏱️
            </div>

            <div>
              <p style={styles.positionLabel}>
                Estimated Wait
              </p>

              <h2 style={styles.positionNumber}>
                {estimatedWait}
              </h2>
            </div>
          </div>

        </section>

        {/* CREATE + CURRENT TOKEN */}

        <section style={styles.contentGrid}>

          {/* CREATE TOKEN */}

          <div style={styles.createCard}>

            <div style={styles.cardHeader}>
              <div style={styles.headerIcon}>+</div>

              <div>
                <h2 style={styles.cardTitle}>
                  Get a Queue Token
                </h2>

                <p style={styles.cardSubtitle}>
                  Enter your details to join the queue.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleCreateToken}
              autoComplete="off"
            >
              <label style={styles.label}>
                Customer Name
              </label>

              <input
                type="text"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(e.target.value)
                }
                style={styles.input}
              />

              <label style={styles.label}>
                Service
              </label>

              <select
                value={service}
                onChange={(e) =>
                  setService(e.target.value)
                }
                style={styles.input}
              >
                <option value="">
                  Select a service
                </option>

                <option value="General Service">
                  General Service
                </option>

                <option value="Customer Service">
                  Customer Service
                </option>

                <option value="Banking Service">
                  Banking Service
                </option>

                <option value="Document Service">
                  Document Service
                </option>
              </select>

              <button
                type="submit"
                disabled={creating}
                style={{
                  ...styles.generateButton,
                  opacity: creating ? 0.7 : 1,
                }}
              >
                {creating
                  ? "Generating..."
                  : "Generate Token →"}
              </button>
            </form>
          </div>

          {/* CURRENT TOKEN */}

          <div style={styles.currentTokenCard}>

            <p style={styles.currentLabel}>
              YOUR LATEST TOKEN
            </p>

            {latestToken ? (
              <>
                <div style={styles.bigToken}>
                  #{latestToken.tokenNumber}
                </div>

                <p style={styles.currentCustomer}>
                  {latestToken.customerName}
                </p>

                <p style={styles.currentService}>
                  {latestToken.service ||
                    "General Service"}
                </p>

                <div
                  style={{
                    ...styles.statusBadge,
                    ...getStatusStyle(
                      latestToken.status
                    ),
                  }}
                >
                  {latestToken.status || "waiting"}
                </div>

                <div style={styles.tokenQueueInfo}>

                  <div style={styles.tokenQueueInfoItem}>
                    <span style={styles.tokenQueueInfoSpan}>
                      Position
                    </span>

                    <strong style={styles.tokenQueueInfoStrong}>
                      {queuePosition === "-"
                        ? "-"
                        : `#${queuePosition}`}
                    </strong>
                  </div>

                  <div style={styles.tokenQueueInfoItem}>
                    <span style={styles.tokenQueueInfoSpan}>
                      Ahead
                    </span>

                    <strong style={styles.tokenQueueInfoStrong}>
                      {latestToken.status === "waiting" ||
                      latestToken.status === "serving"
                        ? peopleAhead
                        : "-"}
                    </strong>
                  </div>

                  <div style={styles.tokenQueueInfoItem}>
                    <span style={styles.tokenQueueInfoSpan}>
                      Wait
                    </span>

                    <strong style={styles.tokenQueueInfoStrong}>
                      {estimatedWait}
                    </strong>
                  </div>

                </div>
              </>
            ) : (
              <div style={styles.noToken}>
                <div style={styles.noTokenIcon}>
                  🎫
                </div>

                <h3>No Token Yet</h3>

                <p>
                  Generate your first token to join
                  the queue.
                </p>
              </div>
            )}

          </div>

        </section>

        {/* MY TOKENS */}

        <section style={styles.sectionCard}>

          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                My Queue Tokens
              </h2>

              <p style={styles.sectionSubtitle}>
                Your recent queue activity
              </p>
            </div>

            <span style={styles.countBadge}>
              {myTokens.length}
            </span>
          </div>

          {loading ? (
            <div style={styles.emptyState}>
              Loading tokens...
            </div>
          ) : myTokens.length === 0 ? (
            <div style={styles.emptyState}>
              No tokens generated yet.
            </div>
          ) : (
            <div style={styles.tokenList}>
              {myTokens.map((token) => (
                <div
                  key={token._id}
                  style={styles.tokenRow}
                >
                  <div style={styles.tokenNumber}>
                    #{token.tokenNumber}
                  </div>

                  <div style={styles.tokenDetails}>
                    <strong>
                      {token.customerName}
                    </strong>

                    <span style={styles.tokenService}>
                      {token.service ||
                        "General Service"}
                    </span>
                  </div>

                  <div style={styles.tokenDate}>
                    {token.createdAt
                      ? new Date(
                          token.createdAt
                        ).toLocaleDateString()
                      : ""}
                  </div>

                  <span
                    style={{
                      ...styles.statusBadge,
                      ...getStatusStyle(
                        token.status
                      ),
                    }}
                  >
                    {token.status || "waiting"}
                  </span>
                </div>
              ))}
            </div>
          )}

        </section>

        {/* LIVE QUEUE */}

        <section style={styles.sectionCard}>

          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                Live Queue
              </h2>

              <p style={styles.sectionSubtitle}>
                Current queue status
              </p>
            </div>

            <span style={styles.liveBadge}>
              ● LIVE
            </span>
          </div>

          {queue.length === 0 ? (
            <div style={styles.emptyState}>
              No customers are currently in the queue.
            </div>
          ) : (
            <div style={styles.queueTable}>

              <div style={styles.tableHeader}>
                <span>Token</span>
                <span>Customer</span>
                <span>Service</span>
                <span>Status</span>
              </div>

              {queue.map((item) => (
                <div
                  key={item._id}
                  style={styles.tableRow}
                >
                  <strong>
                    #{item.tokenNumber}
                  </strong>

                  <span>
                    {item.customerName}
                  </span>

                  <span>
                    {item.service ||
                      "General Service"}
                  </span>

                  <span
                    style={{
                      ...styles.tableStatus,
                      color:
                        getStatusStyle(
                          item.status
                        ).color,
                    }}
                  >
                    ● {item.status}
                  </span>
                </div>
              ))}

            </div>
          )}

        </section>

      </main>

      {/* FOOTER */}

      <footer style={styles.footer}>
        Digital Queue Management System
        <span> • </span>
        Smart • Fast • Organized
      </footer>

    </div>
  );
}

// ==========================================
// STATUS STYLE
// ==========================================

function getStatusStyle(status) {
  if (status === "completed") {
    return {
      background: "#dcfce7",
      color: "#166534",
    };
  }

  if (status === "serving") {
    return {
      background: "#fef3c7",
      color: "#92400e",
    };
  }

  if (status === "skipped") {
    return {
      background: "#fee2e2",
      color: "#991b1b",
    };
  }

  return {
    background: "#dbeafe",
    color: "#1d4ed8",
  };
}

// ==========================================
// STYLES
// ==========================================

const styles = {
  dashboard: {
    minHeight: "100vh",
    background: "#f5f7fb",
    color: "#172554",
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  navbar: {
    background:
      "linear-gradient(90deg, #172554, #1e40af)",
    color: "white",
    padding: "18px 45px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow:
      "0 4px 15px rgba(15,23,42,0.15)",
  },

  brandSection: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
  },

  logo: {
    width: "48px",
    height: "48px",
    borderRadius: "13px",
    background: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
  },

  brandTitle: {
    margin: 0,
    fontSize: "22px",
  },

  brandSubTitle: {
    margin: "3px 0 0",
    color: "#fbfdfc",
    fontSize: "12px",
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  userInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "3px",
    fontSize: "13px",
  },

  logoutButton: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "35px 25px",
  },

  welcomeSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  smallText: {
    color: "#64748b",
    margin: 0,
    fontSize: "14px",
  },

  welcomeTitle: {
    margin: "5px 0",
    fontSize: "32px",
  },

  welcomeDescription: {
    margin: 0,
    color: "#64748b",
  },

  refreshButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "11px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  message: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    color: "#1d4ed8",
    padding: "13px 16px",
    borderRadius: "9px",
    marginBottom: "22px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
    marginBottom: "20px",
  },

  statCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow:
      "0 4px 15px rgba(15,23,42,0.06)",
  },

  statIconBlue: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "#dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statIconYellow: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "#fef3c7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statIconGreen: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "#dcfce7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statIconPurple: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "#ede9fe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  statLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  statNumber: {
    margin: "5px 0 0",
    fontSize: "25px",
  },

  positionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
    marginBottom: "25px",
  },

  positionCard: {
    background: "white",
    padding: "18px 20px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow:
      "0 4px 15px rgba(15,23,42,0.06)",
    border: "1px solid #e2e8f0",
  },

  positionIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "#dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  positionIconYellow: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "#fef3c7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  positionIconGreen: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "#dcfce7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  positionLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "12px",
  },

  positionNumber: {
    margin: "5px 0 0",
    fontSize: "22px",
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "20px",
    marginBottom: "25px",
  },

  createCard: {
    background: "white",
    padding: "28px",
    borderRadius: "14px",
    boxShadow:
      "0 4px 15px rgba(15,23,42,0.06)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "25px",
  },

  headerIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    fontWeight: "bold",
  },

  cardTitle: {
    margin: 0,
    fontSize: "20px",
  },

  cardSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    marginTop: "15px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
  },

  input: {
    width: "100%",
    padding: "13px",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    background: "white",
    color: "#172554",
  },

  generateButton: {
    width: "100%",
    marginTop: "22px",
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    background:
      "linear-gradient(90deg, #2563eb, #1d4ed8)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
  },

  currentTokenCard: {
    background:
      "linear-gradient(145deg, #172554, #1e40af)",
    color: "white",
    padding: "30px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow:
      "0 8px 20px rgba(30,64,175,0.2)",
  },

  currentLabel: {
    margin: 0,
    color: "#bfdbfe",
    fontSize: "11px",
    letterSpacing: "1.5px",
    fontWeight: "bold",
  },

  bigToken: {
    fontSize: "58px",
    fontWeight: "bold",
    margin: "25px 0 5px",
  },

  currentCustomer: {
    margin: "5px 0",
    fontSize: "18px",
    fontWeight: "600",
  },

  currentService: {
    margin: "5px 0 20px",
    color: "#bfdbfe",
    fontSize: "13px",
  },

  statusBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  tokenQueueInfo: {
    marginTop: "25px",
    paddingTop: "18px",
    borderTop:
      "1px solid rgba(255,255,255,0.2)",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
  },

  tokenQueueInfoItem: {
    display: "flex",
    flexDirection: "column",
  },

  tokenQueueInfoSpan: {
    color: "#bfdbfe",
    fontSize: "10px",
  },

  tokenQueueInfoStrong: {
    fontSize: "16px",
    marginTop: "4px",
  },

  noToken: {
    marginTop: "40px",
    color: "#dbeafe",
  },

  noTokenIcon: {
    fontSize: "40px",
  },

  sectionCard: {
    background: "white",
    padding: "25px",
    borderRadius: "14px",
    marginBottom: "25px",
    boxShadow:
      "0 4px 15px rgba(15,23,42,0.06)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "20px",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  countBadge: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  liveBadge: {
    color: "#16a34a",
    fontSize: "12px",
    fontWeight: "bold",
  },

  tokenList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  tokenRow: {
    display: "grid",
    gridTemplateColumns:
      "100px 1fr 150px 100px",
    alignItems: "center",
    gap: "15px",
    padding: "15px",
    border: "1px solid #e2e8f0",
    borderRadius: "9px",
  },

  tokenNumber: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#2563eb",
  },

  tokenDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  tokenService: {
    color: "#64748b",
    fontSize: "12px",
  },

  tokenDate: {
    color: "#64748b",
    fontSize: "12px",
  },

  emptyState: {
    padding: "35px",
    textAlign: "center",
    color: "#64748b",
  },

  queueTable: {
    border: "1px solid #e2e8f0",
    borderRadius: "9px",
    overflow: "hidden",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns:
      "1fr 2fr 2fr 1fr",
    padding: "14px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "bold",
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns:
      "1fr 2fr 2fr 1fr",
    padding: "15px",
    borderTop: "1px solid #e2e8f0",
    alignItems: "center",
    fontSize: "14px",
  },

  tableStatus: {
    fontWeight: "600",
    fontSize: "13px",
  },

  footer: {
    textAlign: "center",
    padding: "25px",
    color: "#94a3b8",
    fontSize: "12px",
  },
};

export default App;