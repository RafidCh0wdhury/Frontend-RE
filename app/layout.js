"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import SidebarPanel from "../component/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { Dancing_Script } from "next/font/google";
const dancingScript = Dancing_Script({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(false);

  useEffect(() => {
    const details = localStorage.getItem("userDetails");
    if (!JSON.parse(details)) {
      setUser(false);
      pathname !== "/auth/signup" && router.push("/auth/login");
    } else {
      setUser(true);
    }
  }, [pathname]);

  return (
    <html lang="en" className={dancingScript.className}>
      <body className="h-screen flex">
        {/* Sidebar */}
        {user && (
          <div className="w-[20%] h-full fixed left-0 top-0 bg-gray-800 text-white">
            <SidebarPanel />
          </div>
        )}

        {/* Main Content */}
        <div
          className={`${
            user ? "ml-[20%] w-[80%]" : "w-full"
          } h-full overflow-y-auto p-4 dashboard-bg`}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
