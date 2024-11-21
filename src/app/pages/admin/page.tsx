"use client";
import Credentials from "@/Components/Credentials";
import Department from "@/Components/Department";
import Designation from "@/Components/Designation";
import Skills from "@/Components/Skills";
import React, { useState } from "react";

// Sidebar items
const sidebarItems = [
  { name: "Credentials", id: "credentials" },
  { name: "Department", id: "department" },
  { name: "Designation", id: "designation" },
  { name: "Skills", id: "skills" },
  // Add more items as needed
];


// Main page component
const page = () => {
  const [activeComponent, setActiveComponent] = useState("credentials");

  // Function to render selected component
  const renderComponent = () => {
    switch (activeComponent) {
      case "credentials":
        return <Credentials />;
      case "department":
        return <Department />;
      case "designation":
        return <Designation />;
      case "skills":
        return <Skills />;
      default:
        return <div className="p-4">Select a section from the sidebar.</div>;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 h-full bg-gray-800 text-white fixed top-0 left-0 mt-16 text-sm md:text-md">
        <nav className="flex flex-col space-y-4 p-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveComponent(item.id)}
              className={`py-2 px-4 text-left rounded-lg hover:bg-gray-700 ${
                activeComponent === item.id ? "bg-gray-700" : ""
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <main className="ml-64 flex-1 p-8 bg-transparent min-h-screen">
        <div className="mt-20">
          <h1 className="text-2xl font-semibold mb-6">Admin Panel - {activeComponent.charAt(0).toUpperCase() + activeComponent.slice(1)}</h1>
          <div className="bg-white rounded-lg shadow-lg p-6">{renderComponent()}</div>
        </div>
      </main>
    </div>
  );
};

export default page;
