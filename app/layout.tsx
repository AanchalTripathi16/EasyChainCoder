import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import LoginProvider from "@/contexts/LoginContext";
import SwapProvider from "@/contexts/Swapcontext";

export const metadata: Metadata = {
  title: "EasyChainCoders",
  description: "One click soultion for NEOX",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <LoginProvider>
        <SwapProvider>
          <body className="w-screen h-screen">
            {/* <Header /> */}
            {children}
          </body>
        </SwapProvider>
      </LoginProvider>
    </html>
  );
}
