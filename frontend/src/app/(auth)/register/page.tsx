import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import RegisterForm from "@/features/auth/components/RegisterForm"

const RegisterPage = () => {
    return (
        <div className="flex justify-center items-center w-full h-screen bg-[#1c1c1c]">
            <Card className="mx-auto w-full max-w-xs" >
                <CardHeader>
                    <CardTitle className="text-center font-black text-3xl">Hello Welcome!</CardTitle>
                    <CardDescription className="text-center">Please enter your details to sign up</CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm />
                </CardContent>
            </Card>
        </div>
    )
}

export default RegisterPage