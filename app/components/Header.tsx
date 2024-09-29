"use client";

import { useLoginContext } from "@/contexts/LoginContext";
import React, { useState } from "react";

export default function Header() {
  const { selectedLink, setSelectedLink, setRoute } = useLoginContext();
  const navLinks = [
    { name: "Home", dex: "home" },
    { name: "About Us", dex: "about" },
    { name: "Chat with Us", dex: "chat" },
  ];
  return (
    <div className="flex justify-between items-center w-full h-[7vh]  px-8">
      <div className="text-gray-300 text-2xl font-semibold">NEO DEX</div>
      <div className="flex flex-row space-x-8 text-gray-500 text-base font normal">
        {navLinks.map((item) => (
          <button
            disabled={item.dex == "about"}
            className={`hover:scale-110 ${
              selectedLink == item.dex && "text-white"
            }`}
            onClick={() => {
              setSelectedLink(item.dex);
              setRoute(null);
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
