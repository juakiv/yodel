import "./globals.scss"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ['latin'] })

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
          {children}
        </div>
      </body>
    </html>
  )
}