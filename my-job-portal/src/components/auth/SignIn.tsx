'use client'
import React, { useState } from 'react';
import { useForm } from "react-hook-form"
import { Box, Stack, Input, Button } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control';
import { PasswordInput } from '@/components/ui/password-input';
import { useColorModeValue } from '@/components/ui/color-mode';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toaster } from '@/components/ui/toaster';
import { useAuth } from '@/context/AuthContext'

interface FormValues {
  email: string
  password: string
}

const SignIn: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [serverMessage, setServerMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()
  const { token, setToken } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  // If already signed in, redirect away from login
  React.useEffect(() => {
    if (token) router.replace('/dashboard')
  }, [token, router])

const onSubmit = handleSubmit(async (data) => {
  setLoading(true)
  setServerMessage(null)
  try {
    // OAuth2PasswordRequestForm expects urlencoded form fields 'username' and 'password'
    const params = new URLSearchParams()
    params.append('username', data.email) // use email as username
    params.append('password', data.password)

    const res = await axios.post('/api/proxy/auth/login', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true,
    })

    const body = res.data
    if (body?.access_token) {
      const token = body.access_token
      try { localStorage.setItem('access_token', token) } catch {}
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      try { document.cookie = `access_token=${encodeURIComponent(token)}; path=/` } catch {}

      // Update context
      try { setToken(token) } catch {}

      setServerMessage({ type: 'success', text: 'Welcome back!' })
      router.push('/dashboard')
    } else {
      const msg = body?.detail || body?.message || 'Invalid response from server'
      setServerMessage({ type: 'error', text: String(msg) })
    }
  } catch (err: any) {
    const msg = err?.response?.data || err?.message || 'Unexpected error'
    setServerMessage({ type: 'error', text: typeof msg === 'string' ? msg : JSON.stringify(msg) })
  } finally {
    setLoading(false)
  }
})
  
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
            <FormControl isInvalid={!!errors.email}>
              <FormLabel color={labelColor}>Email</FormLabel>
              <Input {...register("email", { required: "Email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })} type="email" />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel color={labelColor}>Password</FormLabel>
              <PasswordInput 
                {...register("password", { required: "Password is required" })} 
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            <Button variant="solid" type="submit" width="full" loading={loading}>
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