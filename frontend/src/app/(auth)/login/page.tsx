import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import LoginForm from "@/features/auth/components/LoginForm"

const LoginPage = () => {
    return (
        <div className="flex justify-center items-center w-full h-screen bg-background">
            <Card className="mx-auto w-full max-w-xs" >
                <CardHeader>
                    <CardTitle className="text-center font-black text-3xl">Welcome Back</CardTitle>
                    <CardDescription className="text-center">Please enter your details to sign in</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginPage
