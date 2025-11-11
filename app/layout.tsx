import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { GoogleOAuthProvider } from "@react-oauth/google"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Project Vivek",
  description:
    "A RAG assisted QnA Bot that can answer questions regarding the Garud Puran in English. The bot is trained on a translation of the Garuda Puraan",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <GoogleOAuthProvider clientId={googleClientId || "223712136939-6lvgbf2mprhds635sl3c1f9fagb56u0h.apps.googleusercontent.com"}>
          <AuthProvider>
            {children}
            <Analytics />
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
