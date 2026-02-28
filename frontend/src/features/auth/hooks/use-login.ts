import { loginUser } from "../services/auth.service";
import { useRouter } from "next/navigation";
export const useLogin = () => {
  const router = useRouter();
  const userLogin = async (data: { email: string; password: string }) => {
    const response = await loginUser(data);
    if (!response) {
      throw new Error("Missing token");
    }
    localStorage.setItem("token", response.token);
    router.push("/dashboard");
  };

  return { userLogin };
};
