type JwtPayload = {
  role?: string;
};

export function getRoleHomePath(role?: string | null) {
  if (role === "admin") {
    return "/admin";
  }

  if (role === "staff") {
    return "/staff";
  }

  return "/dashboard";
}

export function getRoleFromAccessToken(token: string) {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(parts[1])) as JwtPayload;
    return payload.role ?? null;
  } catch {
    return null;
  }
}
