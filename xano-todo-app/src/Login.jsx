import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE = "https://x8ki-letl-twmt.n7.xano.io/api:tOBhqZaF";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    // Basic client-side validation
    if (!email) {
      setErr("Email is required");
      return;
    }
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErr("Invalid email format");
      return;
    }
    if (!password) {
      setErr("Password is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        setErr("Invalid response from server");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setErr(data.message || "Login failed");
        setLoading(false);
        return;
      }
      // save token + user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {err && <div className="text-red-600 mb-4">{err}</div>}
      <label htmlFor="email" className="block mb-1 font-semibold">
        Email
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <label htmlFor="password" className="block mb-1 font-semibold">
        Password
      </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full p-2 bg-blue-600 text-white rounded ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
