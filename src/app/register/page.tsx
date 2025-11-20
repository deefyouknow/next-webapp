"use client"
import { useState } from "react";
import { useAuth } from '../../components/useauth';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    console.log("Response:", res.status, data);
    if (res.ok) {
      alert("Register successful");
      router.push('/');
    } else {
      alert(data.detail || "Register failed");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Register
          </h1>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                placeholder="Choose a username"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                placeholder="At least 8 characters"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Register
            </button>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-green-600 font-semibold">
              Login
            </a>
          </p>
        </div>
      </div>
    );
  }
  if (isLoggedIn) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-white">
        <div className="flex flex-row space-x-4 text-gray-800">
          <h1 className="text-4xl font-bold border-r pr-6">404</h1>
          <h2 className="text-xl pl-2">This page could not be found.</h2>
        </div>
      </div>
    )
  }
}
