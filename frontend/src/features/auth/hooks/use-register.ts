import { registerUser } from "../services/auth.service";

export const useRegister = () => {
  const CreateUser = async (data: {
    email: string;
    username: string;
    password: string;
  }) => {
    return await registerUser(data);
  };

  return { CreateUser };
};
