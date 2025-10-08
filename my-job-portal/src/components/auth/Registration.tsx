'use client'
import { Box, Button, Field, HStack, Input, Stack } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { FileUpload } from "@chakra-ui/react"
import { HiUpload } from "react-icons/hi"
import { PasswordInput, PasswordStrengthMeter } from "@/components/ui/password-input"
import { useColorModeValue } from "@/components/ui/color-mode"

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

  const onSubmit = handleSubmit((data) => {
    console.log(data)
    // Add registration logic here
  })

  // Color values for light and dark modes
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
        <form onSubmit={onSubmit}>
          <Stack gap={6} w="full" maxW="500px">
            {/* FileUpload */}
            <Field.Root required>
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
            </Field.Root>

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