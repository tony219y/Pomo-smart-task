"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useForm } from 'react-hook-form'
import Link from "next/link";
import { RegisterInput, registerSchema } from "../schemas/auth.schema";
import { useAuth } from "../hooks/use-auth";


const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema), });
  const { CreateUser } = useAuth();

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
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2">
        <label htmlFor="email">Email Address</label>
        <Input {...register("email")} placeholder="john@example.com" />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>
      <div className="mb-2">
        <label htmlFor="username">Username</label>
        <Input {...register("username")} placeholder="john doe" />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
        )}
      </div>
      <div className="mb-2">
        <label htmlFor="password">Password</label>
        <Input {...register('password')} type="password" placeholder="password" />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>
      <div className="mb-2">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <Input  {...register('confirmPassword')} type="password" placeholder="confirm password" />
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
