'use client'
import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Flex, 
  Heading, 
  Text, 
  VStack,
  Image
} from '@chakra-ui/react';

const Hero: React.FC = () => {
  return (
    <Box bg="bg.subtle" py={20}>
      <Container maxW="7xl">
        <VStack gap={8} textAlign="center">
          <VStack gap={4}>
            <Heading size="2xl" color="fg">
              🌟 Welcome to Nexora
            </Heading>
            <Text fontSize="xl" color="fg.muted" maxW="2xl">
              Next-Gen Job Finding Application — where opportunities meet talent.
              Find your dream job, connect with top companies, and take the next big step in your career.
            </Text>
          </VStack>
          
          <Button 
            colorScheme="blue" 
            size="lg" 
            px={8}
            py={6}
          >
            Check Out Latest Openings
          </Button>

          {/* Stats or Features */}
          <Flex gap={12} mt={12} wrap="wrap" justify="center">
            <VStack>
              <Text fontSize="3xl" fontWeight="bold" color="blue.500">1000+</Text>
              <Text color="fg.muted">Active Jobs</Text>
            </VStack>
            <VStack>
              <Text fontSize="3xl" fontWeight="bold" color="blue.500">500+</Text>
              <Text color="fg.muted">Companies</Text>
            </VStack>
            <VStack>
              <Text fontSize="3xl" fontWeight="bold" color="blue.500">50k+</Text>
              <Text color="fg.muted">Job Seekers</Text>
            </VStack>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default Hero;