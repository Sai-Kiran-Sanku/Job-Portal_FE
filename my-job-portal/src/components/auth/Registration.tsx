'use client'
import { Box, Button, Field, HStack, Input, Stack } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { FileUpload } from "@chakra-ui/react"
import { HiUpload } from "react-icons/hi"
import { PasswordInput, PasswordStrengthMeter } from "@/components/ui/password-input"
import { useColorModeValue } from "@/components/ui/color-mode"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

interface FormValues {
  firstName: string
  lastName: string
  email: string
  password: string
  resume?: FileList
}

const Registration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormValues>()

  const password = watch("password", "")

  const [loading, setLoading] = useState(false)
  const [serverMessage, setServerMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()
  const { token } = useAuth()

  // If already signed in, redirect away
  useEffect(() => {
    if (token) router.replace('/dashboard')
  }, [token, router])

  const normalizeMessage = (m: any): string => {
    if (!m) return ""
    if (typeof m === "string") return m
    if (Array.isArray(m)) return m.map(normalizeMessage).join("; ")
    if (typeof m === "object") {
      if (typeof m.message === "string") return m.message
      if (typeof m.detail === "string") return m.detail
      if (typeof m.msg === "string") return m.msg
      // flatten object values
      const parts = Object.entries(m).map(([k, v]) => `${k}: ${normalizeMessage(v)}`)
      return parts.join(" | ")
    }
    return String(m)
  }

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true)
    setServerMessage(null)
    try {
      // Backend expects a JSON object in the request body (no form-data)
      const payload = {
        f_name: data.firstName,
        l_name: data.lastName,
        email: data.email,
        password: data.password,
      }

      const res = await fetch("/api/proxy/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      })
      console.log("Registration response status:", payload)
      const json = await res.json().catch(() => null  )

      if (!res.ok) {
        const msg = json?.detail || json?.message || json || res.statusText || "Registration failed"
        setServerMessage({ type: "error", text: normalizeMessage(msg) })
        return
      }

      setServerMessage({ type: "success", text: "Account created Succesfully" })
      router.push("/login")
    } catch (err: any) {
      setServerMessage({ type: "error", text: normalizeMessage(err?.message || err) })
    } finally {
      setLoading(false)
    }
  })

  const labelColor = useColorModeValue('gray.900', 'gray.100')
  const linkColor = useColorModeValue('blue.600', 'blue.300')

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={containerStyle}>
      <Box p="12" shadow="lg" borderRadius="lg" borderWidth="1px">
        {serverMessage && (
          <Box mb={4} p={3} borderRadius="md" bg={serverMessage.type === 'error' ? 'red.50' : 'green.50'} color={serverMessage.type === 'error' ? 'red.800' : 'green.800'}>
            {serverMessage.text}
          </Box>
        )}
        <form onSubmit={onSubmit}>
          <Stack gap={6} w="full" maxW="500px">
            {/* FileUpload */}
            {/* <Field.Root required>
              <Field.Label color={labelColor}>
                Resume
                <Field.RequiredIndicator />
              </Field.Label>
              <FileUpload.Root maxFiles={1} required>
                <FileUpload.HiddenInput {...register("resume")} />
                <FileUpload.Trigger asChild>
                  <Button variant="surface" size="sm">
                    <HiUpload />
                    <Box ml={2}>Upload Resume</Box>
                  </Button>
                </FileUpload.Trigger>
                <FileUpload.List showSize clearable />
              </FileUpload.Root>
            </Field.Root> */}

            {/* Name Fields Group */}
            <HStack gap={4} w="full">
              {/* FirstName */}
              <Field.Root invalid={!!errors.firstName} required>
                <Field.Label color={labelColor}>
                  First name
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input 
                  {...register("firstName", { 
                    required: "First name is required",
                    minLength: { value: 2, message: "Minimum 2 characters required" }
                  })} 
                />
                <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
              </Field.Root>
              
              {/* lastName */}
              <Field.Root invalid={!!errors.lastName} required>
                <Field.Label color={labelColor}>
                  Last name
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input 
                  {...register("lastName", { 
                    required: "Last name is required",
                    minLength: { value: 2, message: "Minimum 2 characters required" }
                  })} 
                />
                <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText>
              </Field.Root>
            </HStack>

            {/* Email */}
            <Field.Root invalid={!!errors.email} required>
              <Field.Label color={labelColor}>
                Email <Field.RequiredIndicator />
              </Field.Label>
              <Input 
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })} 
                placeholder="Enter your email" 
                type="email"
              />
              <Field.HelperText>We'll never share your email.</Field.HelperText>
              <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
            </Field.Root>

            {/* Password */}
            <Field.Root invalid={!!errors.password} required>
              <Field.Label color={labelColor}>
                Password
                <Field.RequiredIndicator />
              </Field.Label>
              <Stack>
                <PasswordInput 
                  {...register("password", { 
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" }
                  })} 
                />
                <PasswordStrengthMeter value={password.length > 0 ? Math.min(password.length / 2, 5) : 0} />
              </Stack>
              <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            </Field.Root>

            {/* Submit */}
            <Button 
              type="submit" 
              size="lg"
              colorScheme="blue"
              width="full"
              loading={loading}
            >
              Create Account
            </Button>

            <Box textAlign="center" color={labelColor}>
              <span>Already have an account? <a href="/login" style={{color: linkColor}}>Sign In</a></span>
            </Box>
          </Stack>
        </form>
      </Box>
    </div>
  )
}

export default Registration;