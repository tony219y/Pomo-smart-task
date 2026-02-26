import api from "@/api/axios";

export const registerUser = async (data: {
  email: string;
  username: string;
  password: string;
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};
