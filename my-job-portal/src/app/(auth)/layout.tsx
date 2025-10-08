'use client'
import React from 'react';
import { Box, Container, Heading, VStack } from '@chakra-ui/react';
import Header from '@/components/layout/Header';
import { ColorModeButton } from '@/components/ui/color-mode';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: "gray.900" }}>
      <Box position="absolute" top={4} right={4}>
        <ColorModeButton />
      </Box>
      {children}
    </Box>
  );
}