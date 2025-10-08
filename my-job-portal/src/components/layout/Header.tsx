'use client'
import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Flex, 
  Heading, 
  Image, 
  Input,
  Spacer,
  Text,
  VStack,
  Group,
  Link
} from '@chakra-ui/react';
import { MdSearch } from 'react-icons/md';

const Header: React.FC = () => {
  const handleSearch = (value: string) => {
    console.log('Search:', value);
    // Add search logic here
  };

  return (
    <Box bg="bg" shadow="sm" borderBottom="1px" borderColor="border.subtle">
      <Container maxW="7xl" py={4}>
        <Flex align="center" gap={4}>
          {/* Logo */}
          <Image
            src="/Logo/default-monochrome.svg"
            alt="Nexora Logo"
            height="40px"
            width="120px"
            draggable={false}
          />

          <Spacer />

          {/* Search Box */}
          <Group maxW="400px" position="relative">
            <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={2}>
              <MdSearch color="gray.400" />
            </Box>
            <Input
              pl={10}
              placeholder="Search jobs, companies, skills..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e.currentTarget.value);
                }
              }}
            />
          </Group>

          <Flex gap={4} align="center">
            <Link href="/jobs">
              <Button variant="ghost" size="sm">
                Jobs
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button colorScheme="blue" size="sm">
                Get Started
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;