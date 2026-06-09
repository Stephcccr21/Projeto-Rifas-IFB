import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.link}>
          Home
        </Link>
      </div>

      <div style={styles.right}>
        {!user && (
          <>
            <Link to="/" style={styles.link}>
              Login
            </Link>

            <Link to="/register" style={styles.link}>
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            <Link to="/dashboard" style={styles.link}>
              Dashboard
            </Link>

            <Link to="/profile" style={styles.link}>
              Profile
            </Link>

            {user?.role === "organizador" && (
              <>
                <Link to="/my-raffles" style={styles.link}>
                  Minhas Rifas
                </Link>

                <Link to="/create-raffle" style={styles.link}>
                  Criar Rifa
                </Link>

                <Link to="/dashboard/pagamentos" style={styles.link}>
                  Pagamentos
                </Link>

                <Link to="/dashboard/comentarios" style={styles.link}>
                  Comentários
                </Link>
              </>
            )}

            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#222",
    color: "white",
  },

  left: {
    display: "flex",
    gap: "10px",
  },

  right: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  link: {
    color: "white",
    textDecoration: "none",
  },

  button: {
    background: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
};