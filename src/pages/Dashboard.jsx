import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import backgroundImg from "../assets/background.jpeg"; 

export default function Dashboard() {
  const username = localStorage.getItem("username") || "Guest";

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      {/* Overlay for dimming */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

      {/* Content over background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 text-center text-white text-lg font-medium">
          <p>
            Welcome,{" "}
            <span className="font-semibold text-yellow-300">{username}</span>
          </p>
        </main>
        <Footer />
      </div>
    </div>
  );
}
