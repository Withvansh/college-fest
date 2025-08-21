// src/services/auth.ts
export const signup = async (
  email: string,
  password: string,
  name: string,
  role: string
): Promise<boolean> => {
  const response = await fetch("http://localhost:3000/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      role,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Signup failed");
  }

  return true;
};
