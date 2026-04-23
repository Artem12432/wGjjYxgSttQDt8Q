import { useState } from "react";
import { api } from "../../app/api/api.ts";
import styles from "./AuthPage.module.css";

export const AuthPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);

    try {
      await api.auth.login({ login, password });

      window.location.href = "/"; 
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.LogInrotationcontainer}>
      <div className={styles.BGImages}></div>
        <div className={styles.LogIncontainer}>
          <input
            type="text"
            className={styles.LogInNameandPassword}
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <br />

          <input
            type="password"
            className={styles.LogInNameandPassword}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />

          <button
            className={styles.LogInbutton}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Loading..." : "LogIn"}
          </button>

          {error && <div style={{ color: "red" }}>{error}</div>}
        </div>
    </div>
  );
};
