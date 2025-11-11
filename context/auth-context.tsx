"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  idToken: string | null
  user: { name?: string; email?: string } | null
  login: (token: string, userData: { name?: string; email?: string }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [idToken, setIdToken] = useState<string | null>(null)
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("id_token")
    const storedUser = localStorage.getItem("user")
    if (storedToken) {
      setIdToken(storedToken)
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
  }, [])

  const login = (token: string, userData: { name?: string; email?: string }) => {
    localStorage.setItem("id_token", token)
    localStorage.setItem("user", JSON.stringify(userData))
    setIdToken(token)
    setUser(userData)
  }

  const logout = () => {
    setIdToken(null)
    setUser(null)
    localStorage.removeItem("id_token")
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ idToken, user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
