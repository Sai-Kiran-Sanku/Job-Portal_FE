'use client'
import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";

export default function Home() {
  return (
    <Box minH="100vh">
      {/* Color Mode Toggle */}
      <Flex justify="end" p={4}>
        <ColorModeButton />
      </Flex>
      
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Job List */}
    </Box>
  );
}
