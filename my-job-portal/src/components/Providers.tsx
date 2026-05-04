"use client";

import { ColorModeProvider, type ColorModeProviderProps } from "./ui/color-mode";
import { JobsProvider } from "@/context/JobsContext";
import ErrorBoundary from "./ErrorBoundary";

interface ProvidersProps extends ColorModeProviderProps {
  children: React.ReactNode;
}

export function Providers({ children, ...colorModeProps }: ProvidersProps) {
  return (
    <ColorModeProvider {...colorModeProps}>
      <JobsProvider>
        <ErrorBoundary>{children}</ErrorBoundary>
      </JobsProvider>
    </ColorModeProvider>
  );
}
