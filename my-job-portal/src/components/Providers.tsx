'use client'

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { Provider as ReduxProvider } from "react-redux"
import { ColorModeProvider, type ColorModeProviderProps } from "./ui/color-mode"
import { store } from "@/lib/store"
import { AuthProvider } from "@/context/AuthContext"

interface ProvidersProps extends ColorModeProviderProps {
  children: React.ReactNode
}

export function Providers({ children, ...colorModeProps }: ProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider {...colorModeProps}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ColorModeProvider>
      </ChakraProvider>
    </ReduxProvider>
  )
}