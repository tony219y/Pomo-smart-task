export interface AdminUser {
  id: number;
  email: string;
  role: "member" | "staff" | "admin" | string;
  active: boolean;
  username: string;
}
