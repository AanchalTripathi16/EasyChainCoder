"use client";

import React, { useEffect, useRef } from "react";
import Dashboard from "./components/Dashboard";

export default function Home() {
  return (
    <div className="relative w-full h-full flex flex-col  xl:text-lg">
      <Dashboard />
    </div>
  );
}
