'use client'
import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Group,
  Heading,
  HStack,
  Input,
  Select,
  Text,
  VStack,
  Flex,
  Badge,
  Separator,
} from '@chakra-ui/react';
import { MdSearch, MdLocationOn, MdWork, MdTune } from 'react-icons/md';

interface JobSearchFilters {
  searchTerm: string;
  location: string;
  jobType: string[];
  experienceLevel: string[];
  salaryRange: string;
  remote: boolean;
}

interface JobSearchProps {
  onFiltersChange?: (filters: JobSearchFilters) => void;
  onSearch?: (searchTerm: string) => void;
}

const JobSearch: React.FC<JobSearchProps> = ({ onFiltersChange, onSearch }) => {
  const [filters, setFilters] = useState<JobSearchFilters>({
    searchTerm: '',
    location: '',
    jobType: [],
    experienceLevel: [],
    salaryRange: '',
    remote: false
  });

  const [showFilters, setShowFilters] = useState(false);

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
  const experienceLevels = ['Entry Level', '1-2 years', '3-5 years', '5+ years', 'Senior Level'];
  const salaryRanges = ['0-3 LPA', '3-6 LPA', '6-10 LPA', '10-15 LPA', '15+ LPA'];

  const handleFilterChange = (key: keyof JobSearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleArrayFilterToggle = (key: 'jobType' | 'experienceLevel', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleFilterChange(key, newArray);
  };

  const handleSearch = () => {
    onSearch?.(filters.searchTerm);
  };

  const clearFilters = () => {
    const clearedFilters: JobSearchFilters = {
      searchTerm: '',
      location: '',
      jobType: [],
      experienceLevel: [],
      salaryRange: '',
      remote: false
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.location) count++;
    if (filters.jobType.length > 0) count += filters.jobType.length;
    if (filters.experienceLevel.length > 0) count += filters.experienceLevel.length;
    if (filters.salaryRange) count++;
    if (filters.remote) count++;
    return count;
  };

  return (
    <Box w="full" maxW="4xl" mx="auto" p={4}>
      <VStack gap={4} align="stretch">
        <HStack gap={2}>
          <Group flex={1} position="relative">
            <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={2}>
              <MdSearch />
            </Box>
            <Input
              pl={10}
              size="lg"
              placeholder="Search jobs, companies, skills..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </Group>

          <Group position="relative">
            <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={2}>
              <MdLocationOn />
            </Box>
            <Input
              pl={10}
              size="lg"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              minW="200px"
            />
          </Group>

          <Button
            size="lg"
            colorScheme="blue"
            px={8}
            onClick={handleSearch}
          >
            Search
          </Button>
        </HStack>

        {/* Filter Toggle Button */}
        {/* Filter Toggle Button */}
        <Flex justify="space-between" align="center">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
          >
            <MdTune />
            <Text ml={2}>Filters</Text>
            {getActiveFiltersCount() > 0 && (
              <Badge ml={2} colorScheme="blue" borderRadius="full">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>

          {getActiveFiltersCount() > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all filters
            </Button>
          )}
        </Flex>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <Flex wrap="wrap" gap={2}>
            {filters.location && (
              <Badge colorScheme="blue" variant="subtle">
                📍 {filters.location}
              </Badge>
            )}
            {filters.jobType.map(type => (
              <Badge key={type} colorScheme="green" variant="subtle">
                💼 {type}
              </Badge>
            ))}
            {filters.experienceLevel.map(level => (
              <Badge key={level} colorScheme="purple" variant="subtle">
                🎯 {level}
              </Badge>
            ))}
            {filters.salaryRange && (
              <Badge colorScheme="orange" variant="subtle">
                💰 {filters.salaryRange}
              </Badge>
            )}
            {filters.remote && (
              <Badge colorScheme="teal" variant="subtle">
                🏠 Remote
              </Badge>
            )}
          </Flex>
        )}

        {/* Expanded Filters */}
        {showFilters && (
          <Box p={6} bg="bg.subtle" borderRadius="lg" border="1px" borderColor="border.subtle">
            <VStack gap={6} align="stretch">
              <Heading size="sm">Filter Options</Heading>

              {/* Job Type */}
              <Box>
                <Text fontWeight="medium" mb={3}>Job Type</Text>
                <Flex wrap="wrap" gap={3}>
                  {jobTypes.map(type => (
                    <HStack key={type} gap={2}>
                      <input 
                        type="checkbox"
                        checked={filters.jobType.includes(type)}
                        onChange={() => handleArrayFilterToggle('jobType', type)}
                        id={`jobType-${type}`}
                      />
                      <Text fontSize="sm">{type}</Text>
                    </HStack>
                  ))}
                </Flex>
              </Box>

              <Separator />

              {/* Experience Level */}
              <Box>
                <Text fontWeight="medium" mb={3}>Experience Level</Text>
                <Flex wrap="wrap" gap={3}>
                  {experienceLevels.map(level => (
                    <HStack key={level} gap={2}>
                      <input 
                        type="checkbox"
                        checked={filters.experienceLevel.includes(level)}
                        onChange={() => handleArrayFilterToggle('experienceLevel', level)}
                        id={`experience-${level}`}
                      />
                      <Text fontSize="sm">{level}</Text>
                    </HStack>
                  ))}
                </Flex>
              </Box>

              <Separator />

              {/* Salary Range */}
              <Box>
                <Text fontWeight="medium" mb={3}>Salary Range</Text>
                <Box maxW="300px">
                  <select 
                    value={filters.salaryRange}
                    onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select salary range</option>
                    {salaryRanges.map(range => (
                      <option key={range} value={range}>
                        ₹{range}
                      </option>
                    ))}
                  </select>
                </Box>
              </Box>

              <Separator />

              {/* Remote Work */}
              <Box>
                <HStack gap={2}>
                  <input 
                    type="checkbox"
                    checked={filters.remote}
                    onChange={(e) => handleFilterChange('remote', e.target.checked)}
                    id="remote-checkbox"
                  />
                  <label htmlFor="remote-checkbox">
                    <Text fontWeight="medium">Remote work opportunities</Text>
                  </label>
                </HStack>
              </Box>
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default JobSearch;