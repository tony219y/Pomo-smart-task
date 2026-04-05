"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useForm } from 'react-hook-form'
import Link from "next/link";
import { toast } from "sonner";
import { RegisterInput, registerSchema } from "../schemas/auth.schema";
import { useAuth } from "../hooks/use-auth";
import { getErrorMessage } from "../utils/get-error-message";

function getPasswordStrength(password: string) {
  if (password.length === 0) return "";
  if (password.length < 15) return "Too short";
  if (password.length < 20) return "Fair";
  if (password.length < 28) return "Good";
  return "Strong";
}

function getPasswordStrengthClass(strength: string) {
  if (strength === "Too short") return "text-red-500";
  if (strength === "Fair") return "text-yellow-500";
  return "text-green-600";
}

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema), });
  const { CreateUser } = useAuth();
  const passwordValue = watch("password", "");
  const passwordStrength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: RegisterInput) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const payload = {
        email: data.email,
        username: data.username,
        password: data.password,
      };
      await CreateUser(payload)
      reset();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Register failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2">
        <label htmlFor="email">Email Address</label>
        <Input {...register("email")} type="email" autoComplete="email" placeholder="john@example.com" />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>
      <div className="mb-2">
        <label htmlFor="username">Username</label>
        <Input {...register("username")} autoComplete="username" placeholder="john doe" />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
        )}
      </div>
      <div className="mb-2">
        <label htmlFor="password">Password</label>
        <Input {...register('password')} type="password" autoComplete="new-password" placeholder="Use a long passphrase" />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
        {!errors.password && passwordStrength && (
          <p className={`text-sm font-medium ${getPasswordStrengthClass(passwordStrength)}`}>Strength: {passwordStrength}</p>
        )}
        <p className="text-sm text-muted-foreground">Use at least 15 characters. Very common passwords are blocked.</p>
      </div>
      <div className="mb-2">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <Input  {...register('confirmPassword')} type="password" autoComplete="new-password" placeholder="confirm password" />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
        )}
      </div>
      <Link href="/login" className="my-2 flex w-full justify-end text-primary hover:underline">I have an account.</Link>
      <Button
        disabled={isLoading}
        className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/80"
        type="submit"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}

export default RegisterForm
