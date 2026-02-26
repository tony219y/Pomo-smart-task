import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { LoginInput, loginSchema } from '../schemas/login.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/api/axios';
import { setToken } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const LoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()

    const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

    const onSubmit = async (data: LoginInput) => {
        if (isLoading) return
        setIsLoading(true)

        try {
            const payload = {
                email: data.email,
                password: data.password,
            };
            const res = await api.post("/auth/login", payload);
            setToken(res);
            reset();
            router.push("/dashboard")
        } catch (error : any) {
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
            <Link href="/register" className="flex w-full justify-end my-2 text-[#28AF60] hover:underline">I don't have an account.</Link>

            <Button
                disabled={isLoading}
                className="w-full bg-[#28AF60] hover:bg-[#28AF60]/80"
                type="submit"
            >
                {isLoading ? "Signing in..." : "Sign in"}
            </Button>
        </form>
    )
}

export default LoginForm
