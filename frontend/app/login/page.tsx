"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { API_URL, setAccessToken } from "@/lib/utils";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async () => {
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Enter username and password");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Login failed");
        setLoading(false);
        return;
      }
      setAccessToken(data.access_token);
      router.push("/dashboard");
    } catch (e) {
      setError("Network error. Is the backend running?");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Link
        href="/"
        className="fixed top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm z-10"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
      <div className="bg-white p-8 rounded-xl shadow w-80 space-y-4 animate-fade-in-up">
        <h1 className="text-xl font-bold text-center">Admin Login</h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-xs text-gray-500 text-center">
          Demo: admin / admin123
        </p>
      </div>
    </div>
  );
}
