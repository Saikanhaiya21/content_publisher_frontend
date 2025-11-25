import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loading } from "../components/Loading";
import { ErrorBanner } from "../components/ErrorBanner";
import "../auth.css";

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  function validate() {
    const errs: Record<string, string> = {};

    if (!email) errs.email = "Email is required.";
    if (!password) errs.password = "Password is required.";

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    try {
      await login(email, password);
      nav("/publications");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>

        <form onSubmit={submit} className="auth-form">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="auth-input"
          />
          {fieldErrors.email && (
            <p className="auth-error">{fieldErrors.email}</p>
          )}

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="auth-input"
          />
          {fieldErrors.password && (
            <p className="auth-error">{fieldErrors.password}</p>
          )}

          <ErrorBanner message={error ?? undefined} />

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <Loading size={16} /> : "Login"}
          </button>
        </form>
        
        <p className="auth-switch">
          Don’t have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}
