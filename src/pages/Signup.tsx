import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loading } from "../components/Loading";
import { ErrorBanner } from "../components/ErrorBanner";
import "../auth.css";

export default function Signup() {
  const { signup, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  function validate() {
    const errs: Record<string, string> = {};

    if (!email) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Invalid email format.";

    if (!password) errs.password = "Password is required.";
    else if (password.length < 6)
      errs.password = "Password must be at least 6 characters.";

    if (!confirm) errs.confirm = "Confirm password is required.";
    else if (password !== confirm)
      errs.confirm = "Passwords do not match.";

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    try {
      await signup(email, password);
      nav("/publications");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create Your Account</h2>

        <ErrorBanner message={error ?? undefined} />

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

          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm Password"
            type="password"
            className="auth-input"
          />
          {fieldErrors.confirm && (
            <p className="auth-error">{fieldErrors.confirm}</p>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <Loading size={16} /> : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
