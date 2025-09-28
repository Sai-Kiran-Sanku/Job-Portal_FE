
"use client"
import { Box, Button, Field, HStack, Input, Stack } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { FileUpload } from "@chakra-ui/react"
import { HiUpload } from "react-icons/hi"
import { PasswordInput, PasswordStrengthMeter } from "#/components/ui/password-input"

interface FormValues {
  firstName: string
  lastName: string
  Email:string
  password:string
}

const Registration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const onSubmit = handleSubmit((data) => console.log(data))
      const containerStyle: React.CSSProperties = {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };
  return (
    <div style={containerStyle}>
        <Box 
        p="12" shadow="md" borderRadius=""
        >
             <form onSubmit={onSubmit}>
                    <Stack gap={6} w="full" maxW="500px">
                        {/* FileUpload */}
                        <Field.Root required>
                            <Field.Label>Resume
                                 <Field.RequiredIndicator />
                            </Field.Label>
                            <FileUpload.Root maxFiles={1} required>
                                <FileUpload.HiddenInput />
                                <FileUpload.Trigger asChild>
                                    <Button variant="surface" size="sm">
                                        <HiUpload />
                                        <Box ml={2}>Upload file</Box>
                                    </Button>
                                </FileUpload.Trigger>
                                <FileUpload.List showSize clearable />
                            </FileUpload.Root>
                        </Field.Root>

                        {/* Name Fields Group */}
                        <HStack gap={4} w="full">
                            {/* FirstName */}
                            <Field.Root invalid={!!errors.firstName} required>
                                <Field.Label>First name
                                    <Field.RequiredIndicator />
                                </Field.Label>
                                <Input {...register("firstName")} />
                                <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
                            </Field.Root>
                            {/* lastName */}
                            <Field.Root invalid={!!errors.lastName} required>
                                <Field.Label>Last name
                                    <Field.RequiredIndicator />
                                </Field.Label>
                                <Input {...register("lastName")} />
                                <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText>
                            </Field.Root>
                        </HStack>

                        {/* Email */}
                        <Field.Root invalid={!!errors.Email} required>
                            <Field.Label>
                                Email <Field.RequiredIndicator />
                            </Field.Label>
                            <Input {...register("Email")} placeholder="Enter your email" />
                            <Field.HelperText>We'll never share your email.</Field.HelperText>
                        </Field.Root>

                        {/* Password */}
                        <Field.Root invalid={!!errors.password} required>
                            <Field.Label>Password
                                 <Field.RequiredIndicator />
                            </Field.Label>
                            <Stack>
                                <PasswordInput {...register("password")} />
                                <PasswordStrengthMeter value={2} />
                            </Stack>
                            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                        </Field.Root>

                        {/* Submit */}
                        <Button 
                            type="submit" 
                            size="lg"
                            colorScheme="blue"
                            width="full"
                            border="1px solid black"
                            // loading={true}
                        >
                            Create Account
                        </Button>
                    </Stack>
            </form>
        </Box>
    </div>
    )
}
export default Registration;    