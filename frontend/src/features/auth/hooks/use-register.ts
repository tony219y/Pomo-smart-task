import { registerUser } from "../services/auth.service";

export const useRegister = () => {
  const register = async (data: {
    email: string;
    username: string;
    password: string;
  }) => {
    return await registerUser(data);
  };

  return { register };
};
