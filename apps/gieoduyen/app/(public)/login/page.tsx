"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    // Simple password check - in production, use proper authentication
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const role = data.role || "admin"; // Default to admin for now
      
      // Redirect based on role
      const redirect = searchParams.get("redirect") || 
        (role === "admin" ? "/admin/templates" : "/templates");
      router.push(redirect);
    } else {
      const errorData = await response.json();
      setError(errorData.error || "Tên đăng nhập hoặc mật khẩu không đúng");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          minWidth: "300px",
        }}
      >
        <h1 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          Đăng nhập
        </h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="username"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Tên đăng nhập:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              autoComplete="username"
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="password"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Mật khẩu:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </div>
          <div
            style={{
              background: "#f0f9ff",
              border: "1px solid #bae6fd",
              borderRadius: "6px",
              padding: "1rem",
              marginBottom: "1rem",
              fontSize: "0.875rem",
            }}
          >
            <div style={{ fontWeight: "600", marginBottom: "0.5rem", color: "#0369a1" }}>
              Demo Credentials (Development):
            </div>
            <div style={{ color: "#0c4a6e", lineHeight: "1.6" }}>
              <div>
                <strong>Admin:</strong>{" "}
                <code style={{ background: "#e0f2fe", padding: "0.2rem 0.4rem", borderRadius: "3px" }}>admin</code> /{" "}
                <code style={{ background: "#e0f2fe", padding: "0.2rem 0.4rem", borderRadius: "3px" }}>admin123</code>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <strong>User:</strong>{" "}
                <code style={{ background: "#e0f2fe", padding: "0.2rem 0.4rem", borderRadius: "3px" }}>user</code> /{" "}
                <code style={{ background: "#e0f2fe", padding: "0.2rem 0.4rem", borderRadius: "3px" }}>user123</code>
              </div>
            </div>
          </div>
          {error && (
            <div
              style={{
                color: "red",
                marginBottom: "1rem",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            minWidth: "300px",
            textAlign: "center",
          }}
        >
          Đang tải...
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

