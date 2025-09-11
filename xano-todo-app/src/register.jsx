import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE = "https://x8ki-letl-twmt.n7.xano.io/api:tOBhqZaF";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    // Client-side validation
    if (!name) return setErr("Name is required");
    if (!email) return setErr("Email is required");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setErr("Invalid email format");
    if (!password) return setErr("Password is required");
    if (password !== confirmPassword) return setErr("Passwords do not match");

    setLoading(true);
    try {
      const res = await fetch(`${BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
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
        setErr(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Optionally save token/user if API returns it
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
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {err && <div className="text-red-600 mb-4">{err}</div>}

      <label htmlFor="name" className="block mb-1 font-semibold">
        Name
      </label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      <label htmlFor="email" className="block mb-1 font-semibold">
        Email
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
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
        placeholder="Password"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      <label htmlFor="confirmPassword" className="block mb-1 font-semibold">
        Confirm Password
      </label>
      <input
        id="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full p-2 bg-blue-600 text-white rounded ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
