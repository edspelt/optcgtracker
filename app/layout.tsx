import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { Toaster } from 'react-hot-toast'
import Navbar from "@/components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OPTCG Tracker",
  description: "Tracking para jugadores de One Piece TCG",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-op-dark`}>
        <ThemeProvider>
          <SessionProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 bg-gray-50 dark:bg-op-dark">
                {children}
              </main>
              <Toaster position="top-right" />
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
