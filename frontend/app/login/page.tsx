"use client";
import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");

  const login = () => {
    if (password === "admin123") {
      localStorage.setItem("admin", "true");
      window.location.href = "/dashboard";
    } else {
      alert("wrong password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-80 space-y-4">
        <h1 className="text-xl font-bold text-center">Admin Login</h1>

        <input
          type="password"
          placeholder="Enter admin password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-black text-white p-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
