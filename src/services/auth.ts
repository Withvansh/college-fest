// src/services/auth.ts
export const signup = async (
  email: string,
  password: string,
  full_name: string,
  role: string
): Promise<boolean> => {
  const requestData = { full_name, email, password, role };
  console.log('Sending signup request:', requestData);
  
  const response = await fetch("http://localhost:3000/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  console.log('Response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.log('Error response:', errorData);
    throw new Error(errorData.message || "Signup failed");
  }

  const responseData = await response.json().catch(() => ({}));
  console.log('Success response:', responseData);
  
  return true;
};

export const login = async(
  email: string,
  password: string,
):Promise<boolean>=>{
  const requestData = {email,password};
  console.log('Sending signin request:', requestData);
  
  const response = await fetch("http://localhost:3000/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });
console.log('Response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.log('Error response:', errorData);
    throw new Error(errorData.message || "Signup failed");
  }

  const responseData = await response.json().catch(() => ({}));
  console.log('Success response:', responseData);
  
  return true;

}
