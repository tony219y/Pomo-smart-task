'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { LoginInput, loginSchema } from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '../hooks/use-auth';

const LoginForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })
    const { userLogin } = useAuth();

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
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-2'>
                <label htmlFor="email">Email Address</label>
                <Input {...register("email")} type="email" placeholder="john@example.com" />
                {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
            </div>
            <div className='mb-2'>
                <label htmlFor="password">Password</label>
                <Input {...register("password")} type="password" placeholder="password" />
                {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
            </div>
            <Link href="/register" className="my-2 flex w-full justify-end text-primary hover:underline">I don't have an account.</Link>

            <Button
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/80"
                type="submit"
            >
                {isLoading ? "Signing in..." : "Sign in"}
            </Button>
        </form>
    )
}

export default LoginForm
