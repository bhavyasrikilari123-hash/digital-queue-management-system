import { useEffect, useState } from "react";

import {
  getQueue,
  updateQueueStatus,
} from "../services/api";

function AdminDashboard({ onLogout }) {
  // ==========================================
  // STATE
  // ==========================================

  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState("");

  // ==========================================
  // LOAD QUEUE
  // ==========================================

  const loadQueue = async () => {
    try {
      setLoading(true);

      const data = await getQueue();

      const queueData = Array.isArray(data)
        ? data
        : data?.queue || [];

      setQueue(queueData);

      setMessage("");
    } catch (error) {
      console.error("Admin queue error:", error);

      setMessage(
        error.message || "Unable to load queue"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadQueue();
  }, []);

  // ==========================================
  // AUTO REFRESH
  // ==========================================

  useEffect(() => {
    const interval = setInterval(() => {
      loadQueue();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdatingId(id);
      setMessage("");

      const data = await updateQueueStatus(
        id,
        status
      );

      setMessage(
        data?.message ||
          `Token updated to ${status}`
      );

      await loadQueue();
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      setMessage(
        error.message ||
          "Failed to update queue status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // SORT QUEUE
  // ==========================================

  const sortedQueue = [...queue].sort(
    (a, b) =>
      Number(a.tokenNumber) -
      Number(b.tokenNumber)
  );

  // ==========================================
  // COUNTS
  // ==========================================

  const totalCount = queue.length;

  const waitingCount = queue.filter(
    (item) => item.status === "waiting"
  ).length;

  const servingCount = queue.filter(
    (item) => item.status === "serving"
  ).length;

  const completedCount = queue.filter(
    (item) => item.status === "completed"
  ).length;

  const skippedCount = queue.filter(
    (item) => item.status === "skipped"
  ).length;

  // ==========================================
  // CURRENT SERVING
  // ==========================================

  const servingCustomer =
    sortedQueue.find(
      (item) => item.status === "serving"
    ) || null;

  // ==========================================
  // NEXT CUSTOMER
  // ==========================================

  const nextCustomer =
    sortedQueue.find(
      (item) => item.status === "waiting"
    ) || null;

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
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
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div style={styles.dashboard}>

      {/* ======================================
          NAVBAR
      ====================================== */}

      <header style={styles.navbar}>

        <div style={styles.brandSection}>

          <div style={styles.logo}>
            Q
          </div>

          <div>
            <h1 style={styles.brandTitle}>
              Digital Queue
            </h1>

            <p style={styles.brandSubtitle}>
              Admin Dashboard
            </p>
          </div>

        </div>

        <div style={styles.adminSection}>

          <div style={styles.adminInfo}>
            <strong>
              Administrator
            </strong>

            <span>
              Queue Management
            </span>
          </div>

          <button
            onClick={onLogout}
            style={styles.logoutButton}
          >
            Logout
          </button>

        </div>

      </header>

      {/* ======================================
          MAIN
      ====================================== */}

      <main style={styles.main}>

        {/* ====================================
            PAGE HEADER
        ==================================== */}

        <section style={styles.pageHeader}>

          <div>
            <p style={styles.smallText}>
              Welcome back 👋
            </p>

            <h2 style={styles.pageTitle}>
              Queue Management
            </h2>

            <p style={styles.pageDescription}>
              Monitor and manage the live
              customer queue.
            </p>
          </div>

          <button
            onClick={loadQueue}
            disabled={loading}
            style={{
              ...styles.refreshButton,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Refreshing..."
              : "↻ Refresh"}
          </button>

        </section>

        {/* ====================================
            MESSAGE
        ==================================== */}

        {message && (
          <div style={styles.message}>
            <span>ℹ️</span>
            <span>{message}</span>
          </div>
        )}

        {/* ====================================
            STATISTICS
        ==================================== */}

        <section style={styles.statsGrid}>

          {/* TOTAL */}

          <div
            style={{
              ...styles.statCard,
              borderTop:
                "4px solid #2563eb",
            }}
          >
            <div style={styles.statIconBlue}>
              📋
            </div>

            <div>
              <p style={styles.statLabel}>
                Total Queue
              </p>

              <h3 style={styles.statNumber}>
                {totalCount}
              </h3>
            </div>
          </div>

          {/* WAITING */}

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

          {/* SERVING */}

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

          {/* COMPLETED */}

          <div
            style={{
              ...styles.statCard,
              borderTop:
                "4px solid #8b5cf6",
            }}
          >
            <div style={styles.statIconPurple}>
              ✓
            </div>

            <div>
              <p style={styles.statLabel}>
                Completed
              </p>

              <h3 style={styles.statNumber}>
                {completedCount}
              </h3>
            </div>
          </div>

        </section>

        {/* ====================================
            QUEUE CONTROL
        ==================================== */}

        <section style={styles.controlGrid}>

          {/* CURRENT SERVING */}

          <div style={styles.controlCard}>

            <div style={styles.controlHeader}>

              <div style={styles.controlIconGreen}>
                ▶
              </div>

              <div>
                <h3 style={styles.controlTitle}>
                  Currently Serving
                </h3>

                <p style={styles.controlSubtitle}>
                  Customer being served now
                </p>
              </div>

            </div>

            {servingCustomer ? (
              <div style={styles.customerBox}>

                <div style={styles.bigTokenSmall}>
                  #{servingCustomer.tokenNumber}
                </div>

                <div style={styles.customerInfo}>

                  <strong>
                    {servingCustomer.customerName}
                  </strong>

                  <span>
                    {servingCustomer.service ||
                      "General Service"}
                  </span>

                </div>

              </div>
            ) : (
              <div style={styles.noCustomer}>
                No customer is currently
                being served.
              </div>
            )}

          </div>

          {/* NEXT CUSTOMER */}

          <div style={styles.controlCard}>

            <div style={styles.controlHeader}>

              <div style={styles.controlIconBlue}>
                ⏭
              </div>

              <div>
                <h3 style={styles.controlTitle}>
                  Next Customer
                </h3>

                <p style={styles.controlSubtitle}>
                  First customer waiting
                </p>
              </div>

            </div>

            {nextCustomer ? (
              <div style={styles.customerBox}>

                <div style={styles.bigTokenSmall}>
                  #{nextCustomer.tokenNumber}
                </div>

                <div style={styles.customerInfo}>

                  <strong>
                    {nextCustomer.customerName}
                  </strong>

                  <span>
                    {nextCustomer.service ||
                      "General Service"}
                  </span>

                </div>

                <button
                  disabled={
                    updatingId ===
                    nextCustomer._id
                  }
                  onClick={() =>
                    handleStatusUpdate(
                      nextCustomer._id,
                      "serving"
                    )
                  }
                  style={styles.serveButton}
                >
                  {updatingId ===
                  nextCustomer._id
                    ? "..."
                    : "▶ Serve"}
                </button>

              </div>
            ) : (
              <div style={styles.noCustomer}>
                No waiting customers.
              </div>
            )}

          </div>

        </section>

        {/* ====================================
            LIVE SUMMARY
        ==================================== */}

        <section style={styles.summaryCard}>

          <div style={styles.summaryHeader}>

            <div>
              <h2 style={styles.sectionTitle}>
                Live Queue
              </h2>

              <p style={styles.sectionSubtitle}>
                Real-time queue overview
              </p>
            </div>

            <span style={styles.liveBadge}>
              ● LIVE
            </span>

          </div>

          <div style={styles.miniStats}>

            <div style={styles.miniCard}>
              <span>Waiting</span>
              <strong>
                {waitingCount}
              </strong>
            </div>

            <div style={styles.miniCard}>
              <span>Serving</span>
              <strong>
                {servingCount}
              </strong>
            </div>

            <div style={styles.miniCard}>
              <span>Completed</span>
              <strong>
                {completedCount}
              </strong>
            </div>

            <div style={styles.miniCard}>
              <span>Skipped</span>
              <strong>
                {skippedCount}
              </strong>
            </div>

          </div>

        </section>

        {/* ====================================
            CUSTOMER QUEUE
        ==================================== */}

        <section style={styles.queueCard}>

          <div style={styles.sectionHeader}>

            <div>
              <h2 style={styles.sectionTitle}>
                Customer Queue
              </h2>

              <p style={styles.sectionSubtitle}>
                Manage each customer token
                using the action buttons.
              </p>
            </div>

            <span style={styles.countBadge}>
              {totalCount} Tokens
            </span>

          </div>

          {/* LOADING */}

          {loading && queue.length === 0 ? (

            <div style={styles.emptyState}>
              <div style={styles.loadingIcon}>
                ⏳
              </div>

              <h3>
                Loading Queue...
              </h3>

              <p>
                Please wait while queue
                information is loaded.
              </p>
            </div>

          ) : queue.length === 0 ? (

            /* EMPTY */

            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                🎫
              </div>

              <h3>
                No Queue Entries
              </h3>

              <p>
                There are currently no
                customers in the queue.
              </p>

            </div>

          ) : (

            /* TABLE */

            <div style={styles.tableWrapper}>

              {/* HEADER */}

              <div style={styles.tableHeader}>

                <span>
                  Token
                </span>

                <span>
                  Customer
                </span>

                <span>
                  Service
                </span>

                <span>
                  Status
                </span>

                <span>
                  Actions
                </span>

              </div>

              {/* ROWS */}

              {sortedQueue.map((item) => {

                const isUpdating =
                  updatingId === item._id;

                return (
                  <div
                    key={item._id}
                    style={{
                      ...styles.tableRow,
                      background:
                        item.status ===
                        "serving"
                          ? "#fffbeb"
                          : "white",
                    }}
                  >

                    {/* TOKEN */}

                    <strong
                      style={
                        styles.tokenNumber
                      }
                    >
                      #{item.tokenNumber}
                    </strong>

                    {/* CUSTOMER */}

                    <div
                      style={
                        styles.customerDetails
                      }
                    >

                      <strong>
                        {item.customerName}
                      </strong>

                      <span>
                        {item.user?.email ||
                          "Customer"}
                      </span>

                    </div>

                    {/* SERVICE */}

                    <span
                      style={
                        styles.serviceText
                      }
                    >
                      {item.service ||
                        "General Service"}
                    </span>

                    {/* STATUS */}

                    <span
                      style={{
                        ...styles.statusBadge,
                        ...getStatusStyle(
                          item.status
                        ),
                      }}
                    >
                      ●{" "}
                      {item.status ||
                        "waiting"}
                    </span>

                    {/* ACTIONS */}

                    <div
                      style={
                        styles.actionGroup
                      }
                    >

                      {/* WAITING */}

                      {item.status ===
                        "waiting" && (
                        <>

                          <button
                            disabled={
                              isUpdating
                            }
                            onClick={() =>
                              handleStatusUpdate(
                                item._id,
                                "serving"
                              )
                            }
                            style={{
                              ...styles.serveButton,
                              opacity:
                                isUpdating
                                  ? 0.6
                                  : 1,
                            }}
                          >
                            {isUpdating
                              ? "..."
                              : "▶ Serve"}
                          </button>

                          <button
                            disabled={
                              isUpdating
                            }
                            onClick={() =>
                              handleStatusUpdate(
                                item._id,
                                "skipped"
                              )
                            }
                            style={{
                              ...styles.skipButton,
                              opacity:
                                isUpdating
                                  ? 0.6
                                  : 1,
                            }}
                          >
                            Skip
                          </button>

                        </>
                      )}

                      {/* SERVING */}

                      {item.status ===
                        "serving" && (
                        <button
                          disabled={
                            isUpdating
                          }
                          onClick={() =>
                            handleStatusUpdate(
                              item._id,
                              "completed"
                            )
                          }
                          style={{
                            ...styles.completeButton,
                            opacity:
                              isUpdating
                                ? 0.6
                                : 1,
                          }}
                        >
                          {isUpdating
                            ? "..."
                            : "✓ Complete"}
                        </button>
                      )}

                      {/* COMPLETED */}

                      {item.status ===
                        "completed" && (
                        <span
                          style={
                            styles.finishedText
                          }
                        >
                          ✓ Completed
                        </span>
                      )}

                      {/* SKIPPED */}

                      {item.status ===
                        "skipped" && (
                        <span
                          style={
                            styles.finishedText
                          }
                        >
                          ⊘ Skipped
                        </span>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>

      </main>

      {/* ======================================
          FOOTER
      ====================================== */}

      <footer style={styles.footer}>
        Digital Queue Management System
        <span> • </span>
        Admin Panel
        <span> • </span>
        Smart • Fast • Organized
      </footer>

    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = {

  dashboard: {
    minHeight: "100vh",
    background: "#f5f7fb",
    color: "#172554",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  // ========================================
  // NAVBAR
  // ========================================

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
    background:
      "rgba(255,255,255,0.15)",
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

  brandSubtitle: {
    margin: "3px 0 0",
    color: "#bfdbfe",
    fontSize: "12px",
  },

  adminSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  adminInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "3px",
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

  // ========================================
  // MAIN
  // ========================================

  main: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "35px 25px",
  },

  pageHeader: {
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

  pageTitle: {
    margin: "5px 0",
    fontSize: "32px",
  },

  pageDescription: {
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
    border:
      "1px solid #bfdbfe",
    color: "#1d4ed8",
    padding: "13px 16px",
    borderRadius: "9px",
    marginBottom: "22px",
  },

  // ========================================
  // STATISTICS
  // ========================================

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "18px",
    marginBottom: "25px",
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
    fontSize: "20px",
  },

  statIconYellow: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "#fef3c7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  statIconGreen: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "#dcfce7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  statIconPurple: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "#ede9fe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
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

  // ========================================
  // CONTROL CARDS
  // ========================================

  controlGrid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "20px",
    marginBottom: "25px",
  },

  controlCard: {
    background: "white",
    padding: "24px",
    borderRadius: "14px",
    boxShadow:
      "0 4px 15px rgba(15,23,42,0.06)",
  },

  controlHeader: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "20px",
  },

  controlIconGreen: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "#dcfce7",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },

  controlIconBlue: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },

  controlTitle: {
    margin: 0,
    fontSize: "17px",
  },

  controlSubtitle: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  customerBox: {
    background: "#f8fafc",
    border:
      "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "15px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  bigTokenSmall: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2563eb",
    minWidth: "70px",
  },

  customerInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
  },

  noCustomer: {
    background: "#f8fafc",
    border:
      "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "20px",
    color: "#64748b",
    textAlign: "center",
    fontSize: "13px",
  },

  // ========================================
  // SUMMARY
  // ========================================

  summaryCard: {
    background: "white",
    padding: "25px",
    borderRadius: "14px",
    marginBottom: "25px",
    boxShadow:
      "0 4px 15px rgba(15,23,42,0.06)",
  },

  summaryHeader: {
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

  liveBadge: {
    color: "#16a34a",
    fontSize: "12px",
    fontWeight: "bold",
  },

  miniStats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "15px",
  },

  miniCard: {
    background: "#f8fafc",
    border:
      "1px solid #e2e8f0",
    padding: "15px",
    borderRadius: "9px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // ========================================
  // QUEUE CARD
  // ========================================

  queueCard: {
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

  countBadge: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  // ========================================
  // TABLE
  // ========================================

  tableWrapper: {
    border:
      "1px solid #e2e8f0",
    borderRadius: "10px",
    overflow: "hidden",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns:
      "80px 1.5fr 1.3fr 120px 220px",
    gap: "15px",
    padding: "15px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "bold",
    alignItems: "center",
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns:
      "80px 1.5fr 1.3fr 120px 220px",
    gap: "15px",
    padding: "16px 15px",
    borderTop:
      "1px solid #e2e8f0",
    alignItems: "center",
    fontSize: "14px",
  },

  tokenNumber: {
    color: "#2563eb",
    fontSize: "18px",
  },

  customerDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: 0,
  },

  serviceText: {
    color: "#475569",
  },

  statusBadge: {
    display: "inline-block",
    width: "fit-content",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  actionGroup: {
    display: "flex",
    gap: "7px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  serveButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  completeButton: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  skipButton: {
    background: "#fee2e2",
    color: "#991b1b",
    border:
      "1px solid #fecaca",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  finishedText: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "600",
  },

  // ========================================
  // EMPTY
  // ========================================

  emptyState: {
    padding: "50px",
    textAlign: "center",
    color: "#64748b",
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  loadingIcon: {
    fontSize: "35px",
    marginBottom: "10px",
  },

  // ========================================
  // FOOTER
  // ========================================

  footer: {
    textAlign: "center",
    padding: "25px",
    color: "#94a3b8",
    fontSize: "12px",
  },
};

export default AdminDashboard;