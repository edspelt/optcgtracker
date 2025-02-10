import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { Toaster } from 'react-hot-toast'
import Navbar from "@/components/Navbar"
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain.com'),
  title: {
    default: 'OP TCG Tracker',
    template: '%s | OP TCG Tracker'
  },
  description: 'Gestiona tus partidas de One Piece TCG',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-op-dark`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
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
        <SpeedInsights />
      </body>
    </html>
  )
}
