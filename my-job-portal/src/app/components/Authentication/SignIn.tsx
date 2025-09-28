'use client'
import React from 'react';
import { useForm } from "react-hook-form"
import { Box, Stack, Input, Button } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control';
import { PasswordInput } from '#/components/ui/password-input';


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


  // Style for centering the Row
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  return (
    <div style={containerStyle}>
       <Box  shadow="lg" borderRadius="lg" borderWidth="1px">
      <form onSubmit={onSubmit}>
      <Stack gap="4" align="flex-start" maxW="500px">
        <FormControl isInvalid={!!errors.username}>
          <FormLabel>Username</FormLabel>
          <Input {...register("username")} />
          <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.password}>
          <FormLabel>Password</FormLabel>
          <PasswordInput {...register("password", { required: true })} id="password" name="password" />
          {/* <PasswordStrengthMeter/> */}
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>
          <Button variant="solid">Sign in</Button>
          <span>Don't have an account? <a href="/signup" style={{color: 'blue'}}>Sign Up</a></span>
      </Stack>
    </form>
    </Box>
    </div>
  );
};

export default SignIn;