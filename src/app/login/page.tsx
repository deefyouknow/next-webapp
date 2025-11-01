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
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-300">
      <a href="./">HOME</a>
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <input
        type="text"
        className="border p-2 w-64 mb-2"
        placeholder="Usesrname" //คำในช่อง input
        value={username} //เก็บค่าใน variable username
        onChange={(e) => setUsername(e.target.value)}
        // เมื่อมีการเปลี่ยนแปลงใน input จะเรียก setUsername เพื่ออัปเดตค่า username ด้วยค่าที่ผู้ใช้กรอก
      />
      <input
        type="password"
        className="border p-2 w-64 mb-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-amber-100 border p-2 mb-2"
        onClick={() => {
          handleLogin();
          checkuserpass();
        }}
      >
        Login
      </button>
    </div>
  );
}
