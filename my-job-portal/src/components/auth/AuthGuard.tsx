"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Spinner, Center } from "@chakra-ui/react"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!token) router.replace('/login')
  }, [token, router])

  if (!token) return (
    <Center minH="60vh"><Spinner size="lg" /></Center>
  )

  return <>{children}</>
}
