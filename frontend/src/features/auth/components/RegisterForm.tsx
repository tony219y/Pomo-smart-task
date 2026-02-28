"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button'
import api from "@/api/axios"
import { Input } from "@/components/ui/input"
import { setToken } from "@/lib/auth"
import { useState } from "react"
import { useForm } from 'react-hook-form'
import { RegisterInput, registerSchema } from '../schemas/register.schema'
import Link from "next/link";
import { useRegister } from "../hooks/use-register";


const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema), });
  const { CreateUser } = useRegister();

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

      <Link href="/login" className="flex w-full justify-end my-2 text-[#28AF60] hover:underline">I have an account.</Link>

      <Button
        disabled={isLoading}
        className="w-full bg-[#28AF60] hover:bg-[#28AF60]/80 mt-2"
        type="submit"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}

export default RegisterForm
