// src/pages/Dashboard.jsx
import React from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4">Welcome to your dashboard </main>
      <Footer />
    </div>
  );
}
