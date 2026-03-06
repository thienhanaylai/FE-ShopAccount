import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const getAvatar = name => (name ? name.trim().charAt(0).toUpperCase() : "?");

const COLORS = ["#4f46e5", "#0891b2", "#059669", "#d97706", "#dc2626", "#7c3aed"];
const avatarColor = id => COLORS[id.charCodeAt(id.length - 1) % COLORS.length];

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/users")
      .then(res => setUsers(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>👥 Danh sách Users Demo Call API</h1>
          {!loading && !error && <span style={styles.badge}>{users.length} người dùng</span>}
        </div>

        {loading && (
          <div style={styles.center}>
            <div style={styles.spinner} />
            <p style={{ color: "#6b7280", marginTop: 12 }}>Đang tải dữ liệu...</p>
          </div>
        )}

        {error && (
          <div style={styles.errorBox}>
            <span>⚠️ {error}</span>
          </div>
        )}

        {!loading && !error && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Avatar</th>
                  <th style={styles.th}>Tên</th>
                  <th style={styles.th}>ID</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} style={styles.tr}>
                    <td style={{ ...styles.td, color: "#9ca3af", width: 40 }}>{index + 1}</td>
                    <td style={{ ...styles.td, width: 50 }}>
                      <div style={{ ...styles.avatar, background: avatarColor(user._id) }}>{getAvatar(user.name)}</div>
                    </td>
                    <td style={{ ...styles.td, fontWeight: 500 }}>{user.name}</td>
                    <td style={{ ...styles.td, fontFamily: "monospace", color: "#6b7280", fontSize: 12 }}>{user._id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "40px 16px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: 720,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 28px 16px",
    borderBottom: "1px solid #e5e7eb",
  },
  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#111827",
  },
  badge: {
    background: "#ede9fe",
    color: "#6d28d9",
    borderRadius: 20,
    padding: "4px 12px",
    fontSize: 13,
    fontWeight: 600,
  },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "48px 0",
  },
  spinner: {
    width: 36,
    height: 36,
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #6d28d9",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  errorBox: {
    margin: 24,
    padding: "14px 18px",
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    borderRadius: 10,
    color: "#991b1b",
    fontSize: 14,
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "12px 20px",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
  },
  tr: {
    borderBottom: "1px solid #f3f4f6",
    transition: "background 0.15s",
  },
  td: {
    padding: "14px 20px",
    fontSize: 14,
    color: "#111827",
    verticalAlign: "middle",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
  },
};

export default HomePage;
