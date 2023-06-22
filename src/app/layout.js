"use client";

import "./globals.scss";
import { Inter, Lobster } from "next/font/google";

import Points from "@/components/Points";
import UserMenu from "@/components/UserMenu";
import Link from "next/link";
import useSession from "@/lib/useSession";

const inter = Inter({ subsets: ["latin"] });
const lobster = Lobster({ subsets: ["latin"], weight: ["400"] });

export const metadata = {
  title: {
    default: "Yodel",
    template: "%s | Yodel"
  },
  icons: {
    icon: "favicon.ico"
  }
}

export default function RootLayout({ children }) {
  const { user } = useSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="container">
          <div className="header">
            <Link href="/" className="logo">
              <img className="logo" src="/logo.png" />
              <span className={lobster.className}>Yodel</span>
            </Link>
            {user && <div className="header-user-area">
              <Points />
              <UserMenu />
            </div>}
          </div>
          {user ? children : 
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>}
        </div>
      </body>
    </html>
  )
}