"use client";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async () => {
    console.log("ส่งข้อมูล:", username, password);

    alert(`name: ${username}, pass: ${password}`);
  };
  // user_login_with_api
  const checkuserpass = async () => {
    const res2 = await fetch("http://dserver.thddns.net:6863/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fname: username,
        lname: password,
      }),
    });
    const data2 = await res2.json();
    console.log(data2);
  };

  return (
    <div className="flex w-full h-full absolute items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>

        <input
          type="text"
          className="w-full p-3 mb-4 bg-transparent border-b-2 border-gray-400 focus:border-indigo-400 placeholder-gray-300 focus:outline-none transition duration-300"
          placeholder="Username" //คำในช่อง input
          value={username} //เก็บค่าใน variable username
          onChange={(e) => setUsername(e.target.value)}
          // เมื่อมีการเปลี่ยนแปลงใน input จะเรียก setUsername เพื่ออัปเดตค่า username ด้วยค่าที่ผู้ใช้กรอก
        />
        <input
          type="password"
          className="w-full p-3 mb-8 bg-transparent border-b-2 border-gray-400 focus:border-indigo-400 placeholder-gray-300 focus:outline-none transition duration-300"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex space-x-4">
          <button
            className="flex-1 bg-indigo-600 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
            onClick={() => {
              handleLogin();
              checkuserpass();
            }}
          >
            Login
          </button>
          <button
            className="flex-1 bg-gray-600 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300"
            onClick={() => {
              handleLogin();
              checkuserpass();
            }}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
