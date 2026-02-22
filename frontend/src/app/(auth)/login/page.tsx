"use client"
import api from "@/api/axios"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { setToken } from "@/lib/auth"
import { useState } from "react"

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (isLoading) return;
        setIsLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            const payload = Object.fromEntries(formData);
            const res = await api.post('/auth/login', payload)
            setToken(res)

            form.reset();
        } catch (error) {
            console.error("Error: ", error)
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="flex justify-center items-center w-full h-screen bg-[#1c1c1c]">
            <Card className="mx-auto w-full max-w-xs" >
                <CardHeader>
                    <CardTitle className="text-center font-black text-3xl">Welcome Back</CardTitle>
                    <CardDescription className="text-center">Please enter your details to sign in</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldSet>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                                    <Input required name="email" type="email" id="email" autoComplete="off" placeholder="name@company.com" />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Input required name="password" id="password" type="password" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" autoComplete="off" />
                                </Field>
                            </FieldGroup>
                            <FieldGroup>
                                <Button
                                    disabled={isLoading}
                                    className="w-full bg-[#28AF60] hover:bg-[#28AF60]/80"
                                    type="submit"
                                >
                                    {isLoading ? "Signing in..." : "Sign in"}
                                </Button>
                            </FieldGroup>
                        </FieldSet>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginPage