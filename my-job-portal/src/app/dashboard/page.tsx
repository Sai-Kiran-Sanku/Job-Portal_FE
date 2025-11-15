'use client'
import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Heading, 
  Text, 
  Card,
  VStack,
  HStack,
  Avatar,
  Badge,
  Stat,
  StatLabel,
  StatValueText,
  StatHelpText
} from '@chakra-ui/react';
import Header from '@/components/layout/Header';
import { ColorModeButton } from '@/components/ui/color-mode';

export default function DashboardPage() {
  return (
    <Box minH="100vh">
      <Box position="absolute" top={4} right={4}>
        <ColorModeButton />
      </Box>
      
      <Header />
      
      <Container maxW="7xl" py={8}>
        <VStack gap={8} align="stretch">
          {/* Welcome Section */}
          <Box>
            <Heading size="lg" mb={2}>Welcome back, John!</Heading>
            <Text color="fg.muted">Here's what's happening with your job search</Text>
          </Box>

          {/* Stats Grid */}
          <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
            <Card.Root>
              <Card.Body>
                <Stat.Root>
                  <StatLabel>Applications Sent</StatLabel>
                  <StatValueText>23</StatValueText>
                  <StatHelpText>+3 this week</StatHelpText>
                </Stat.Root>
              </Card.Body>
            </Card.Root>

            <Card.Root>
              <Card.Body>
                <Stat.Root>
                  <StatLabel>Interviews Scheduled</StatLabel>
                  <StatValueText>5</StatValueText>
                  <StatHelpText>+2 this week</StatHelpText>
                </Stat.Root>
              </Card.Body>
            </Card.Root>

            <Card.Root>
              <Card.Body>
                <Stat.Root>
                  <StatLabel>Profile Views</StatLabel>
                  <StatValueText>147</StatValueText>
                  <StatHelpText>+12 this week</StatHelpText>
                </Stat.Root>
              </Card.Body>
            </Card.Root>
          </Grid>

          {/* Recent Applications */}
          <Card.Root>
            <Card.Header>
              <Heading size="md">Recent Applications</Heading>
            </Card.Header>
            <Card.Body>
              <VStack gap={4} align="stretch">
                {[
                  { company: 'TechCorp', position: 'SDE1', status: 'Interview', date: '2 days ago' },
                  { company: 'InnoSoft', position: 'Frontend Engineer', status: 'Applied', date: '1 week ago' },
                  { company: 'DataWorks', position: 'Data Engineer', status: 'Rejected', date: '2 weeks ago' },
                ].map((app, index) => (
                  <HStack key={index} justify="space-between" p={4} bg="bg.subtle" borderRadius="md">
                    <HStack>
                      <Avatar.Root size="sm">
                        <Avatar.Fallback>{app.company.slice(0, 2).toUpperCase()}</Avatar.Fallback>
                      </Avatar.Root>
                      <VStack align="start" gap={0}>
                        <Text fontWeight="medium">{app.position}</Text>
                        <Text fontSize="sm" color="fg.muted">{app.company}</Text>
                      </VStack>
                    </HStack>
                    <HStack>
                      <Badge 
                        colorScheme={
                          app.status === 'Interview' ? 'blue' : 
                          app.status === 'Applied' ? 'orange' : 'red'
                        }
                      >
                        {app.status}
                      </Badge>
                      <Text fontSize="sm" color="fg.subtle">{app.date}</Text>
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            </Card.Body>
          </Card.Root>
        </VStack>
      </Container>
    </Box>
  );
}