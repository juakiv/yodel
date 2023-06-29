import "react-toastify/dist/ReactToastify.css";
import "./globals.scss";

import { Inter, Lobster } from "next/font/google";
import { ToastContainer } from "react-toastify";

import Points from "@/components/Points";
import UserMenu from "@/components/UserMenu";
import Link from "next/link";

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
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="container">
          <div className="header">
            <Link href="/" className="logo">
              <img width="40" height="40" className="logo" src="/logo.png" />
              <span className={lobster.className}>Yodel</span>
            </Link>
            <div className="header-user-area">
              <Points />
              <UserMenu />
            </div>
          </div>
          {children}
        </div>
        <ToastContainer />
      </body>
    </html>
  )
}