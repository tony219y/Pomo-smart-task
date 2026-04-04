import { useAuthStore } from "@/store/auth-store";
import { GetProfile, getGoogleLoginUrl, loginUser, registerUser } from "../services/auth.service";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getRoleFromAccessToken, getRoleHomePath } from "../utils/role-navigation";

export const useAuth = () => {
  const router = useRouter();

  const { setAccessToken } = useAuthStore();

  const userLogin = async (data: { email: string; password: string }) => {
    const response = await loginUser(data);
    if (!response?.accessToken) {
      throw new Error("Missing token");
    }
    setAccessToken(response.accessToken);
    router.push(getRoleHomePath(getRoleFromAccessToken(response.accessToken)));
  };

  const GoogleLogin = async () => {
    const loginUrl = getGoogleLoginUrl();
    window.location.href = loginUrl;
  };

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

  const useProfile = (enabled = true) => {
    return useQuery({
      queryKey: ["user-profile"],
      enabled,
      queryFn: async () => {
        const response = await GetProfile();
        if (!response) {
          toast.error("Get profile failed!");
          return;
        }
        return response.data;
      },
      staleTime: 1000 * 60 * 5,
    },
  );
  };

  return { userLogin, CreateUser, useProfile, GoogleLogin };
};
