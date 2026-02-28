import { useRouter } from "next/navigation";
import { registerUser } from "../services/auth.service";

export const useRegister = () => {
  const router = useRouter();

  const CreateUser = async (data: {
    email: string;
    username: string;
    password: string;
  }) => {
    const response = await registerUser(data);
    if (!response) {
      throw new Error("Register Failed");
    }
    router.push("/login");
  };

  return { CreateUser };
};
