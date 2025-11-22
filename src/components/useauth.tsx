"use client";
import { useState, useEffect } from "react";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
            throw new Error("Session expired");
          }
          if (!res.ok) throw new Error("Invalid token");
          return res.json();
        })
        .then(data => {
          setIsLoggedIn(true);
          setUser(data.username);
        })
        .catch(err => {
          console.error("Auth error:", err);
          if (err.message === "Session expired" || err.message === "Invalid token") {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
          }
        });
    }
  }, []);

  return { isLoggedIn, user };
}
