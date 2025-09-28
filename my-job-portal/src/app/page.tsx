'use client'
import Image from "next/image";
import JobList from "./components/jobs/JobList";
import Header from "./components/Home/Header";
import Hero from "./components/Hero";
import SignIn from "./components/Authentication/SignIn";
import { MdDarkMode } from "react-icons/md";
import Registration from "./components/Authentication/userRegistration";
import { CiDark } from "react-icons/ci";
import React, { useState } from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
export default function Home() {
  const [mode, setMode] = useState("light");

  return (
    <div
    style={{
         backgroundColor: mode === "light" ? "#000" : "#fff",
         color: mode === "light" ? "#fff" : "#000",
      }}
    
    >
      <div 
      style={{ textAlign: "end", marginTop: "10px"
      }}>
        <button
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          style={{
            padding: "8px 16px",
            fontSize: "16px",
            cursor: "pointer",
            border: "none",
            borderRadius: "4px",
          }}
        >
         {mode === "light" ? <MdOutlineLightMode /> :  <MdDarkMode />}
        </button>
      </div>
      {/* <JobList/> 
      <Header/> */}
          {/* <Hero/> */}
      {/* <SignIn/> */}
        <Registration/>
    </div>
  );
}
