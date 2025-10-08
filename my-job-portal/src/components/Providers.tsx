'use client'

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { Provider as ReduxProvider } from "react-redux"
import { ColorModeProvider, type ColorModeProviderProps } from "./ui/color-mode"
import { store } from "@/lib/store"

interface ProvidersProps extends ColorModeProviderProps {
  children: React.ReactNode
}

export function Providers({ children, ...colorModeProps }: ProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider {...colorModeProps}>
          {children}
        </ColorModeProvider>
      </ChakraProvider>
    </ReduxProvider>
  )
}