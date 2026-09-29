import { useEffect, useState } from "react";

import {
  getQueue,
  getMyTokens,
  createQueueToken,
} from "../services/api";

function UserDashboard({ onLogout }) {
  const [queue, setQueue] = useState([]);
  const [myTokens, setMyTokens] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [service, setService] = useState("");

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [message, setMessage] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // ==============================
  // LOAD DASHBOARD
  // ==============================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setMessage("");

      const queueData = await getQueue();
      const tokenData = await getMyTokens();

      setQueue(queueData?.queue || []);
      setMyTokens(tokenData?.queue || []);
    } catch (error) {
      console.error(error);
      setMessage(
        error.message || "Failed to load queue"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // ==============================
  // CREATE TOKEN
  // ==============================

  const handleCreateToken = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!customerName.trim()) {
      setMessage("Please enter customer name");
      return;
    }

    try {
      setCreating(true);

      const data = await createQueueToken({
        customerName: customerName.trim(),
        service:
          service.trim() || "General Service",
      });

      setMessage(
        data.message ||
          "Token generated successfully!"
      );

      setCustomerName("");
      setService("");

      await loadDashboard();
    } catch (error) {
      setMessage(
        error.message ||
          "Failed to generate token"
      );
    } finally {
      setCreating(false);
    }
  };

  // ==============================
  // CALCULATIONS
  // ==============================

  const waitingCount = queue.filter(
    (item) => item.status === "waiting"
  ).length;

  const servingCount = queue.filter(
    (item) => item.status === "serving"
  ).length;

  const latestToken =
    myTokens.length > 0
      ? myTokens[0]
      : null;

  // ==============================
  // STATUS STYLE
  // ==============================

  const getStatusStyle = (status) => {
    if (status === "completed") {
      return {
        background: "#dcfce7",
        color: "#15803d",
      };
    }

    if (status === "serving") {
      return {
        background: "#fef3c7",
        color: "#b45309",
      };
    }

    if (status === "skipped") {
      return {
        background: "#fee2e2",
        color: "#dc2626",
      };
    }

    return {
      background: "#dbeafe",
      color: "#2563eb",
    };
  };

  return (
    <div style={styles.page}>

      {/* =================================
          HEADER
      ================================= */}

      <header style={styles.header}>

        <div style={styles.brandArea}>
          <div style={styles.logo}>
            Q
          </div>

          <div>
            <h1 style={styles.brand}>
              Digital Queue
            </h1>

            <p style={styles.role}>
              User Dashboard
            </p>
          </div>
        </div>

        <div style={styles.headerRight}>

          <div style={styles.userInfo}>
            <strong>
              {user?.name || "User"}
            </strong>

            <span>
              {user?.email || ""}
            </span>
          </div>

          <button
            onClick={onLogout}
            style={styles.logout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* =================================
          MAIN
      ================================= */}

      <main style={styles.main}>

        {/* WELCOME */}

        <div style={styles.welcomeRow}>

          <div>
            <p style={styles.overline}>
              PERSONAL QUEUE CENTER
            </p>

            <h2 style={styles.heading}>
              Welcome back,{" "}
              {user?.name?.split(" ")[0] ||
                "User"} 👋
            </h2>

            <p style={styles.subHeading}>
              Get your token and track your
              queue position easily.
            </p>
          </div>

          <button
            onClick={loadDashboard}
            disabled={loading}
            style={styles.refresh}
          >
            ↻ {loading ? "Loading..." : "Refresh"}
          </button>

        </div>

        {/* MESSAGE */}

        {message && (
          <div style={styles.message}>
            {message}
          </div>
        )}

        {/* =================================
            STATS
        ================================= */}

        <div style={styles.statsGrid}>

          <div
            style={{
              ...styles.statCard,
              borderTop:
                "4px solid #2563eb",
            }}
          >
            <div style={styles.statIconBlue}>
              🎫
            </div>

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
              borderTop:
                "4px solid #f59e0b",
            }}
          >
            <div style={styles.statIconYellow}>
              ⏳
            </div>

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
              borderTop:
                "4px solid #10b981",
            }}
          >
            <div style={styles.statIconGreen}>
              ▶
            </div>

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
              borderTop:
                "4px solid #8b5cf6",
            }}
          >
            <div style={styles.statIconPurple}>
              #
            </div>

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

        </div>

        {/* =================================
            CREATE TOKEN + LATEST TOKEN
        ================================= */}

        <div style={styles.contentGrid}>

          {/* CREATE TOKEN */}

          <section style={styles.formCard}>

            <div style={styles.sectionTitle}>
              <div style={styles.plusIcon}>
                +
              </div>

              <div>
                <h2>
                  Join the Queue
                </h2>

                <p>
                  Enter your details to
                  generate a token.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleCreateToken}
            >

              <label style={styles.label}>
                Customer Name
              </label>

              <input
                type="text"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(
                    e.target.value
                  )
                }
                style={styles.input}
              />

              <label style={styles.label}>
                Service
              </label>

              <input
                type="text"
                placeholder="Enter service"
                value={service}
                onChange={(e) =>
                  setService(
                    e.target.value
                  )
                }
                style={styles.input}
              />

              <button
                type="submit"
                disabled={creating}
                style={styles.generateButton}
              >
                {creating
                  ? "Generating..."
                  : "Generate Token →"}
              </button>

            </form>

          </section>

          {/* LATEST TOKEN */}

          <section style={styles.latestCard}>

            <p style={styles.latestLabel}>
              YOUR LATEST TOKEN
            </p>

            {latestToken ? (
              <>
                <div style={styles.ticketIcon}>
                  🎟️
                </div>

                <h2 style={styles.bigToken}>
                  #{latestToken.tokenNumber}
                </h2>

                <h3 style={styles.customerName}>
                  {latestToken.customerName}
                </h3>

                <p style={styles.serviceName}>
                  {latestToken.service ||
                    "General Service"}
                </p>

                <span
                  style={{
                    ...styles.latestStatus,
                    ...getStatusStyle(
                      latestToken.status
                    ),
                  }}
                >
                  {latestToken.status}
                </span>
              </>
            ) : (
              <>
                <div style={styles.ticketIcon}>
                  🎟️
                </div>

                <h2 style={styles.noToken}>
                  No Token Yet
                </h2>

                <p style={styles.noTokenText}>
                  Generate your first token
                  to join the queue.
                </p>
              </>
            )}

          </section>

        </div>

        {/* =================================
            RECENT ACTIVITY
        ================================= */}

        <section style={styles.activityCard}>

          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.overline}>
                HISTORY
              </p>

              <h2>
                Recent Queue Activity
              </h2>
            </div>

            <span style={styles.countBadge}>
              {myTokens.length}
            </span>
          </div>

          {myTokens.length === 0 ? (
            <div style={styles.empty}>
              No tokens generated yet.
            </div>
          ) : (
            <div style={styles.activityList}>

              {myTokens.slice(0, 5).map(
                (token) => (
                  <div
                    key={token._id}
                    style={styles.activityRow}
                  >

                    <div
                      style={
                        styles.tokenCircle
                      }
                    >
                      #{token.tokenNumber}
                    </div>

                    <div
                      style={
                        styles.activityInfo
                      }
                    >
                      <strong>
                        {token.customerName}
                      </strong>

                      <span>
                        {token.service ||
                          "General Service"}
                      </span>
                    </div>

                    <div
                      style={
                        styles.activityDate
                      }
                    >
                      {token.createdAt
                        ? new Date(
                            token.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </div>

                    <span
                      style={{
                        ...styles.statusBadge,
                        ...getStatusStyle(
                          token.status
                        ),
                      }}
                    >
                      {token.status}
                    </span>

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* =================================
            CURRENT QUEUE
        ================================= */}

        <section style={styles.queueCard}>

          <div style={styles.sectionHeader}>

            <div>
              <p style={styles.overline}>
                LIVE QUEUE
              </p>

              <h2>
                Current Queue Status
              </h2>
            </div>

            <span style={styles.live}>
              ● LIVE
            </span>

          </div>

          {queue.length === 0 ? (
            <div style={styles.empty}>
              No queue entries available.
            </div>
          ) : (
            <div style={styles.table}>

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
                      ...getStatusStyle(
                        item.status
                      ),
                    }}
                  >
                    ● {item.status}
                  </span>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* FOOTER */}

        <footer style={styles.footer}>
          Digital Queue Management System
          <span> • </span>
          Smart • Fast • Organized
        </footer>

      </main>

    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#172554",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  header: {
    background:
      "linear-gradient(90deg, #172554, #1d4ed8)",
    color: "white",
    padding: "18px 45px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brandArea: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  logo: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background:
      "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    fontWeight: "bold",
  },

  brand: {
    margin: 0,
    fontSize: "22px",
  },

  role: {
    margin: "4px 0 0",
    fontSize: "12px",
    color: "#bfdbfe",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "22px",
  },

  userInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "3px",
  },

  logout: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "10px 19px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  main: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "38px 25px",
  },

  welcomeRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
  },

  overline: {
    margin: 0,
    color: "#2563eb",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "2px",
  },

  heading: {
    margin: "8px 0",
    fontSize: "31px",
  },

  subHeading: {
    margin: 0,
    color: "#64748b",
  },

  refresh: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "11px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  message: {
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "18px",
    marginBottom: "25px",
  },

  statCard: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow:
      "0 5px 20px rgba(15,23,42,0.06)",
  },

  statIconBlue: {
    background: "#dbeafe",
    color: "#2563eb",
    padding: "13px",
    borderRadius: "10px",
  },

  statIconYellow: {
    background: "#fef3c7",
    color: "#d97706",
    padding: "13px",
    borderRadius: "10px",
  },

  statIconGreen: {
    background: "#d1fae5",
    color: "#059669",
    padding: "13px",
    borderRadius: "10px",
  },

  statIconPurple: {
    background: "#ede9fe",
    color: "#7c3aed",
    padding: "13px",
    borderRadius: "10px",
    fontWeight: "bold",
  },

  statLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  statNumber: {
    margin: "5px 0 0",
    fontSize: "24px",
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns:
      "1.15fr 0.85fr",
    gap: "22px",
    marginBottom: "25px",
  },

  formCard: {
    background: "white",
    borderRadius: "14px",
    padding: "28px",
    boxShadow:
      "0 5px 20px rgba(15,23,42,0.06)",
  },

  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "25px",
  },

  plusIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
  },

  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "7px",
    marginTop: "15px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
  },

  generateButton: {
    width: "100%",
    marginTop: "20px",
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    background:
      "linear-gradient(90deg, #2563eb, #1d4ed8)",
    color: "white",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  latestCard: {
    background:
      "linear-gradient(145deg, #172554, #2563eb)",
    borderRadius: "14px",
    padding: "30px",
    color: "white",
    textAlign: "center",
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },

  latestLabel: {
    fontSize: "11px",
    letterSpacing: "2px",
    fontWeight: "700",
    color: "#bfdbfe",
  },

  ticketIcon: {
    fontSize: "28px",
    marginTop: "10px",
  },

  bigToken: {
    fontSize: "48px",
    margin: "8px 0 0",
  },

  customerName: {
    margin: "2px 0",
  },

  serviceName: {
    margin: "4px 0 15px",
    color: "#dbeafe",
    fontSize: "13px",
  },

  latestStatus: {
    padding: "7px 15px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },

  noToken: {
    margin: "10px 0 5px",
  },

  noTokenText: {
    color: "#dbeafe",
    fontSize: "13px",
  },

  activityCard: {
    background: "white",
    borderRadius: "14px",
    padding: "25px",
    marginBottom: "25px",
    boxShadow:
      "0 5px 20px rgba(15,23,42,0.06)",
  },

  queueCard: {
    background: "white",
    borderRadius: "14px",
    padding: "25px",
    boxShadow:
      "0 5px 20px rgba(15,23,42,0.06)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  countBadge: {
    background: "#eff6ff",
    color: "#2563eb",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  live: {
    color: "#16a34a",
    fontSize: "12px",
    fontWeight: "700",
  },

  activityList: {
    display: "flex",
    flexDirection: "column",
  },

  activityRow: {
    display: "grid",
    gridTemplateColumns:
      "70px 1fr 130px 100px",
    alignItems: "center",
    gap: "15px",
    padding: "15px 5px",
    borderTop: "1px solid #e2e8f0",
  },

  tokenCircle: {
    color: "#2563eb",
    fontWeight: "700",
  },

  activityInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  activityInfoSpan: {
    color: "#64748b",
  },

  activityDate: {
    color: "#94a3b8",
    fontSize: "12px",
  },

  statusBadge: {
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    textAlign: "center",
  },

  table: {
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    overflow: "hidden",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns:
      "1fr 2fr 2fr 1fr",
    padding: "14px",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns:
      "1fr 2fr 2fr 1fr",
    alignItems: "center",
    padding: "15px",
    borderTop: "1px solid #e2e8f0",
    fontSize: "13px",
  },

  tableStatus: {
    width: "fit-content",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
  },

  empty: {
    padding: "30px",
    textAlign: "center",
    color: "#94a3b8",
  },

  footer: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "11px",
    marginTop: "30px",
    paddingBottom: "15px",
  },
};

export default UserDashboard;