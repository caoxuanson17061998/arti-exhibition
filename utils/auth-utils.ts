// Authentication utility functions

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  lastLogin: string;
}

// Get stored authentication token
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

// Get stored user info
export function getUserInfo(): UserInfo | null {
  if (typeof window === "undefined") return null;

  const userInfoString = localStorage.getItem("user_info");
  if (!userInfoString) return null;

  try {
    return JSON.parse(userInfoString);
  } catch (error) {
    console.error("Error parsing user info:", error);
    return null;
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  const userInfo = getUserInfo();
  return !!(token && userInfo);
}

// Clear authentication data
export function clearAuth(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_info");
}

// Verify token with server
export async function verifyAuthToken(): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const response = await fetch("/api/auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({token}),
    });

    return response.ok;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
}

// Set up axios interceptor for auth token
export function setupAuthInterceptor() {
  // This would be useful if using axios
  // For now, we're using fetch, so we'll handle auth headers manually
}

// Get auth headers for API requests
export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? {Authorization: `Bearer ${token}`} : {};
}
