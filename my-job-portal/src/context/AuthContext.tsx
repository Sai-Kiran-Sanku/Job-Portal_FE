"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

interface AuthContextValue {
  token: string | null
  setToken: (t: string | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null)

  useEffect(() => {
    // Initialize token from localStorage or cookie (fallback)
    let t: string | null = null
    try {
      t = localStorage.getItem("access_token")
    } catch {}
    if (!t) {
      const m = document.cookie.match(/(?:^|; )access_token=([^;]+)/)
      if (m) t = decodeURIComponent(m[1])
    }
    setTokenState(t)
  }, [])

  const setToken = (t: string | null) => {
    setTokenState(t)
    try {
      if (t) localStorage.setItem("access_token", t)
      else localStorage.removeItem("access_token")
    } catch {}
    // Mirror into non-httpOnly cookie so middleware (server) can read it until backend sets secure httpOnly cookie
    try {
      if (t) document.cookie = `access_token=${encodeURIComponent(t)}; path=/`;
      else document.cookie = `access_token=; Max-Age=0; path=/`;
    } catch {}
  }

  const logout = () => setToken(null)

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
