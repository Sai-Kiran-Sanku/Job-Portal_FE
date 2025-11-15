'use client'
import React from 'react';
import { useForm } from "react-hook-form"
import { Box, Stack, Input, Button } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control';
import { PasswordInput } from '@/components/ui/password-input';
import { useColorModeValue } from '@/components/ui/color-mode';

interface FormValues {
  username: string
  password: string
}

const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const onSubmit = handleSubmit((data) => console.log(data))
  
  // Color values for light and dark modes
  const labelColor = useColorModeValue('gray.400', 'gray.900')
  const linkColor = useColorModeValue('blue.600', 'blue.300')

  // Style for centering the Row
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={containerStyle}>
       <Box shadow="lg" borderRadius="lg" borderWidth="1px" p={8}>
        <form onSubmit={onSubmit}>
          <Stack gap="4" align="flex-start" maxW="500px">
            <FormControl isInvalid={!!errors.username}>
              <FormLabel color={labelColor}>Username</FormLabel>
              <Input {...register("username", { required: "Username is required" })} />
              <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel color={labelColor}>Password</FormLabel>
              <PasswordInput 
                {...register("password", { required: "Password is required" })} 
                id="password" 
                name="password" 
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            <Button variant="solid" type="submit" width="full">
              Sign in
            </Button>
            <Box textAlign="center" color={labelColor}>
              <span>Don't have an account? <a href="/register" style={{color: linkColor}}>Sign Up</a></span>
            </Box>
          </Stack>
        </form>
      </Box>
    </div>
  );
};

export default SignIn;