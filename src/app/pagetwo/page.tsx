"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [eiei, upen] = useState("1");
  const [open, setOpen] = useState(true);
  const statusText: Record<string, string> = {
    "1": "เปิด",
    "2": "ปิด",
    "3": "กำลังโหลด...",
  };
  const [fn, setfn] = useState("");
  const [ln, setln] = useState("");
  const sendData = async() => {
    const res = await fetch("http://dserver.thddns.net:6863/send",
      {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            fnamess: fn,
            lnamess: ln,
          }
        ),
      }
    );
    const data = await res.json();
    console.log(data);
    // alert(`แสดงค่า ID ${data.result.id} แสดงค่าชื่อ ${data.result.fname} แสดงนามสกุล ${data.result.lname}`);
  };
  // ส่วน GetAllUser
  const [alluser, GetAllUser] = useState<{id: number,fname:string,lname:string}[]>([]);
  const getDataUser = async() => {
    const res = await fetch("http://dserver.thddns.net:6863/allUser",
      {
        method: "GET",
        headers: {
          "accept": "application/json",
        },
      }
    );
    const data = await res.json();
    GetAllUser(data.msg);
  }
 

  return (
    <div className="p-10 flex-row bg-red-200 h-screen w-screen">
      <p>ตอนนี้ค่า open = {eiei === "1" ? "1 (เปิด)" : "2 (ปิด) "}</p>
      <button onClick={() => upen("1")}>open</button>
      <br />
      <button onClick={() => upen("2")}>close</button>
      <br />
      <nav className={open ? "translate-x-0" : "-translate-x-full"}>
        Sidebar
      </nav>
      <button onClick={() => setOpen(true)}>
        show
      </button>
      <button onClick={() => setOpen(false)}>
        hidden
      </button>
      <br />
      <input className="border-amber-950 bg-amber-50" type="text" />
      <br />
      <br />
      <input className="border-amber-950 bg-amber-50" type="text" />
      <br />
      <button onClick={() => alert("clicked")}>
        Enter
      </button>
      <div>
      <input
        placeholder="firstname"
        value={fn}
        onChange={(e) => setfn(e.target.value)}
      />
      <input
        placeholder="lastname"
        value={ln}
        onChange={(e) => setln(e.target.value)}
      />
      <button onClick={() => { sendData(); getDataUser();}}>Send</button>
      <br />
      <button onClick={getDataUser}>โหลดข้อมูลทั้งหมด</button>
      <ul className="space-y-2">
        {
          alluser.map(
            (u) => (
              <li key={u.id} className="">
                {u.id}. {u.fname}. {u.lname}
              </li>
            )
          )
        }
      </ul>
    </div>
    <h1>input</h1>
    <input placeholder=""
    
    />
    </div>
  );
}
