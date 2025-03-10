"use client";

import React from "react";
import { useLoginContext } from "@/contexts/LoginContext";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { sleepTimer } from "../utils/helper";
import Loader from "./Loader";

// Define ethereum interface
interface EthereumProvider {
  isMetaMask?: boolean;
  providers?: EthereumProvider[];
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  selectedAddress?: string;
  [key: string]: any;
}

// Extend Window interface
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

let ethereum: EthereumProvider | null = null;
if (typeof window !== "undefined") {
  ethereum = window?.ethereum || null;
}

const Sidebar = () => {
  const {
    address,
    setAddress,
    selectedLink,
    setSelectedLink,
    setRoute,
    route,
  } = useLoginContext();
  const [loading, setLoading] = React.useState<boolean>(false);

  const connectMetamask = async () => {
    setLoading(true);
    try {
      const metamaskConnector = new MetaMaskConnector();
      const { account } = await metamaskConnector.connect({
        chainId: 12227332,
      });
      await sleepTimer(1000);
      console.log(account);
      setAddress(account);
      setLoading(false);

      const justProvider =
        ethereum?.providers?.find((e: EthereumProvider) => e?.isMetaMask) ||
        ethereum;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const navLinks = [
    { name: "Home", dex: "home" },
    { name: "Swap", dex: "dex" },
    { name: "Bridge", dex: "bridge" },
    { name: "Token Launcher", dex: "token" },
    { name: "Liquidity", dex: "liquidity" },
    { name: "Chat with Us", dex: "chat" },
  ];

  const handleNavClick = (dex: string) => {
    if (dex === "home" || dex === "chat") {
      setSelectedLink(dex);
      setRoute(null);
    } else {
      setRoute(dex);
      setSelectedLink(null);
    }
  };

  return (
    <div className="h-full w-64 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <div className=" text-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Sonic DEX
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {!address ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <p className="text-gray-400 text-sm text-center mb-4">
              Connect your wallet to access all features
            </p>
            {!loading ? (
              <button
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-base font-normal w-full py-3 flex flex-row space-x-3 justify-center items-center rounded-md"
                onClick={connectMetamask}
              >
                <img src="/Metamask.png" alt="Logo" className="size-6" />
                <p>Connect Metamask</p>
              </button>
            ) : (
              <Loader />
            )}
          </div>
        ) : (
          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <button
                key={item.dex}
                className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                  selectedLink === item.dex || route === item.dex
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => handleNavClick(item.dex)}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User info */}
      {address && (
        <div className="p-2.5 border-t border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-xs text-white">
                {address.substring(0, 2)}
              </span>
            </div>
            <div className="text-gray-400 text-sm truncate">
              {address.substring(0, 6)}...
              {address.substring(address.length - 4)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
