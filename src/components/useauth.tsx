"use client";
import { useState, useEffect } from "react";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://127.0.0.1:8000/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error("Invalid token");
          return res.json();
        })
        .then(data => {
          setIsLoggedIn(true);
          
        });
    }
  }, []);

  return { isLoggedIn, user };
}
