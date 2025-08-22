

export interface AuthResponse {
  success: boolean;
 
  user?: {
    _id: string;
    email: string;
    full_name: string;
    role: string;
    token: string;
    
  };
  message?: string;
}

// User signup with role selection
export const signup = async (
  email: string,
  password: string,
  full_name: string,
  role: string
): Promise<AuthResponse> => {
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
  
  return {
    success: true,
    user: responseData.user || {
      id: responseData.id || Date.now().toString(),
      email,
      name: full_name,
      role,
      token: responseData.token || 'mock-token-' + Date.now()
    }
  };
};

// User login - returns user data with token for dashboard access
export const login = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const requestData = { email, password };
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
    throw new Error(errorData.message || "Login failed");
  }

  const responseData = await response.json().catch(() => ({}));
  console.log('Success response:', responseData);
  
  return {
     success: true,
    user: responseData.user
      ? { ...responseData.user, token: responseData.token } 
      : {
          _id: responseData._id || '1',
          email,
          full_name: responseData.full_name || 'User',
          role: responseData.role || 'jobseeker',
          token: responseData.token || 'mock-token-' + Date.now(),
        },
  };
};
