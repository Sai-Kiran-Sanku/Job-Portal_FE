"use client";

import { Provider as ReduxProvider } from "react-redux";
import { ColorModeProvider, type ColorModeProviderProps } from "./ui/color-mode";
import { store } from "@/lib/store";
import { AuthProvider } from "@/context/AuthContext";
import { JobsProvider } from "@/context/JobsContext";
import ErrorBoundary from "./ErrorBoundary";

interface ProvidersProps extends ColorModeProviderProps {
  children: React.ReactNode;
}

export function Providers({ children, ...colorModeProps }: ProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <ColorModeProvider {...colorModeProps}>
        <AuthProvider>
          <JobsProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
          </JobsProvider>
        </AuthProvider>
      </ColorModeProvider>
    </ReduxProvider>
  );
}
