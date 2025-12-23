'use client'
import React, { useState, useMemo } from "react";
import { useAppDispatch } from "../../lib/hooks/useRedux";
import { MdOutlineDescription, MdLocationOn, MdWork } from "react-icons/md";
import {
  Badge,
  Box,
  Button,
  Card,
  CloseButton,
  Dialog,
  HStack,
  Portal,
  Grid,
  GridItem,
  Text,
  VStack,
  Container,
  Heading
} from "@chakra-ui/react";
import { useEffect } from "react";
import JobSearch from "./JobSearch";
import mockjobs from "../../mock/data";

const JobList = () => {
  const dispatch = useAppDispatch();
  // const { jobs, loading, error } = useAppSelector((state) => state.jobs);
  const [filteredJobs, setFilteredJobs] = useState(mockjobs);

  // useEffect(() => {
  //   dispatch(fetchJobs());
  // }, [dispatch]);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredJobs(mockjobs);
      return;
    }

    const filtered = mockjobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  const handleFiltersChange = (filters: any) => {
    let filtered = [...mockjobs];

    // Apply search term filter
    if (filters.searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        job.company_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply job type filter
    if (filters.jobType.length > 0) {
      filtered = filtered.filter(job => 
        filters.jobType.includes(job.employment_type)
      );
    }

    // Apply experience level filter
    if (filters.experienceLevel.length > 0) {
      filtered = filtered.filter(job => 
        filters.experienceLevel.some((level: string) => 
          job.experience.toLowerCase().includes(level.toLowerCase())
        )
      );
    }

    // Apply remote filter
    if (filters.remote) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes('remote')
      );
    }

    setFilteredJobs(filtered);
  };

  // if (loading) return <p>Loading jobs...</p>;
  // if (error) return <p>Error: {error}</p>;

  return (
    <Container maxW="7xl" py={8}>
      <VStack gap={8} align="stretch">
        {/* Search Component */}
        <JobSearch 
          onSearch={handleSearch}
          onFiltersChange={handleFiltersChange}
        />

        {/* Results Header */}
        <Box>
          <Heading size="md" mb={2}>
            {filteredJobs.length} Jobs Found
          </Heading>
          <Text color="fg.muted">
            Discover opportunities that match your skills and preferences
          </Text>
        </Box>

        {/* Job Cards Grid */}
        <Grid templateColumns="repeat(auto-fit, minmax(400px, 1fr))" gap={6}>
          {filteredJobs.map((job: any, index: number) => (
            <Card.Root key={index} variant="elevated" size="lg">
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Box>
                    <Card.Title fontSize="xl" mb={2}>{job.title}</Card.Title>
                    <Text color="fg.muted" fontWeight="medium">{job.company_name}</Text>
                  </Box>
                  
                  <HStack gap={4} wrap="wrap">
                    <HStack>
                      <MdLocationOn />
                      <Text fontSize="sm" color="fg.muted">{job.location}</Text>
                    </HStack>
                    <HStack>
                      <MdWork />
                      <Text fontSize="sm" color="fg.muted">{job.employment_type}</Text>
                    </HStack>
                    <Badge colorScheme="blue" size="sm">
                      {job.experience}
                    </Badge>
                  </HStack>

                  <Text 
                    fontSize="sm" 
                    color="fg"
                    css={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {job.description}
                  </Text>

                  <HStack gap={3} pt={2}>
                    <Dialog.Root size="lg" scrollBehavior="inside">
                      <Dialog.Trigger asChild>
                        <Button variant="outline" size="sm">
                          <MdOutlineDescription />
                          View Details
                        </Button>
                      </Dialog.Trigger>
                      <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                          <Dialog.Content>
                            <Dialog.Header>
                              <Dialog.Title>{job.title} - {job.company_name}</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.CloseTrigger asChild>
                              <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                            <Dialog.Body>
                              <VStack align="start" gap={4}>
                                <Box>
                                  <Text fontWeight="bold" mb={2}>Job Description</Text>
                                  <Text>{job.description}</Text>
                                </Box>
                                <HStack gap={6}>
                                  <Box>
                                    <Text fontWeight="bold">Location:</Text>
                                    <Text>{job.location}</Text>
                                  </Box>
                                  <Box>
                                    <Text fontWeight="bold">Type:</Text>
                                    <Text>{job.employment_type}</Text>
                                  </Box>
                                  <Box>
                                    <Text fontWeight="bold">Experience:</Text>
                                    <Text>{job.experience}</Text>
                                  </Box>
                                </HStack>
                                <Box>
                                  <Text fontWeight="bold">Posted:</Text>
                                  <Text>{job.date_posted}</Text>
                                </Box>
                              </VStack>
                            </Dialog.Body>
                          </Dialog.Content>
                        </Dialog.Positioner>
                      </Portal>
                    </Dialog.Root>
                    
                    <Button colorScheme="blue" size="sm">
                      Apply Now
                    </Button>
                  </HStack>
                </VStack>
              </Card.Body>
            </Card.Root>
          ))}
        </Grid>

        {/* No Results Message */}
        {filteredJobs.length === 0 && (
          <Box textAlign="center" py={12}>
            <Text fontSize="xl" color="fg.muted" mb={2}>
              No jobs found matching your criteria
            </Text>
            <Text color="fg.subtle">
              Try adjusting your search terms or filters
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default JobList;