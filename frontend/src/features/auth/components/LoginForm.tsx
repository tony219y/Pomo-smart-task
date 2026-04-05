'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image';
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { LoginInput, loginSchema } from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '../hooks/use-auth';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })
  const { userLogin, GoogleLogin } = useAuth();

  const onSubmit = async (data: LoginInput) => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const payload = {
        email: data.email,
        password: data.password,
      };
      await userLogin(payload)
      reset();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
    }

  return (
    <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-2'>
          <label htmlFor="email">Email Address</label>
          <Input {...register("email")} type="email" autoComplete="email" placeholder="john@example.com" />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
            <div className='mb-2'>
          <label htmlFor="password">Password</label>
                <Input {...register("password")} type="password" autoComplete="current-password" placeholder="password" />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
            <Link href="/register" className="my-2 flex w-full justify-end text-primary hover:underline">I don&apos;t have an account.</Link>

        <Button
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/80"
          type="submit"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <hr className="w-full my-4 border-gray-300/20" />

      <Button
        type="button"
        className="w-full bg-white text-black hover:bg-white/80"
        onClick={GoogleLogin}
      >
        <Image src="/google.png" alt="Google" width={20} height={20} />
        {isLoading ? "Signing in..." : "Continue with google"}
      </Button>
    </>
  );
};

export default LoginForm
