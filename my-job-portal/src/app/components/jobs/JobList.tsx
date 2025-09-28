"use client"
import { useAppDispatch, useAppSelector } from "#/lib/Hooks/useRedux";
import { fetchJobs } from "#/lib/Slice/jobSlice";
import { MdOutlineDescription } from "react-icons/md";
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
  GridItem
} from "@chakra-ui/react";
import { useEffect } from "react";
import mockjobs from "./data";
  
const JobList = () => {
  const dispatch = useAppDispatch();
  // const { jobs, loading, error } = useAppSelector((state) => state.jobs);

  // useEffect(() => {
  //   dispatch(fetchJobs());
  // }, [dispatch]);

  // if (loading) return <p>Loading jobs...</p>;
  // if (error) return <p>Error: {error}</p>;

  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={4}>
      {/* Left sidebar / column */}
      <GridItem colSpan={1} bg="red.100" p={4}>
        <p>Left Sidebar</p>
      </GridItem>

      {/* Right column with job cards */}
      <GridItem colSpan={3}>
        {mockjobs.map((job, index) => (
          <Card.Root key={index} overflow="hidden" mb={8}>
            <Box border="1px solid black" p={4}>
              <Card.Body>
                <Card.Title mb="2">{job.title}</Card.Title>
                <Card.Description>
                  Caffè latte is a coffee beverage of Italian origin made with
                  espresso and steamed milk.
                </Card.Description>
                <HStack mt="4">
                  <Dialog.Root size="md" scrollBehavior="outside">
                    <Dialog.Trigger asChild>
                      <Button variant="outline" p={2}>
                        <MdOutlineDescription size={20} />
                      </Button>
                    </Dialog.Trigger>
                    <Portal>
                      <Dialog.Backdrop />
                      <Dialog.Positioner>
                        <Dialog.Content>
                          <Dialog.Header>
                            <Dialog.Title>With Outside Scroll</Dialog.Title>
                          </Dialog.Header>
                          <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                          </Dialog.CloseTrigger>
                          <Dialog.Body>{job.description}</Dialog.Body>
                        </Dialog.Content>
                      </Dialog.Positioner>
                    </Portal>
                  </Dialog.Root>
                </HStack>
              </Card.Body>
              <Card.Footer>
                <Button>Apply here</Button>
              </Card.Footer>
            </Box>
          </Card.Root>
        ))}
      </GridItem>
    </Grid>
  
  );
};

export default JobList;
