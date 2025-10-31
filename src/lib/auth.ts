/**
 * Frontend-only authentication for POC
 * Simple string equality check - no backend validation
 */

export interface User {
  id: number;
  email: string;
  name?: string;
  age?: number;
  bloodType?: string;
  allergies?: string;
}

// Demo credentials for POC (stored in localStorage as a simple check)
// In a real app, this would be handled by a backend
const DEMO_CREDENTIALS = {
  email: "demo@medalert.com",
  password: "demo123",
};

const STORAGE_KEY = "medalert_session";
const USER_STORAGE_KEY = "medalert_user";

/**
 * Check if credentials match (string equality)
 */
export function validateCredentials(email: string, password: string): boolean {
  return email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;
}

/**
 * Sign in user (frontend only)
 */
export function signIn(email: string, password: string): { success: boolean; user?: User } {
  if (validateCredentials(email, password)) {
    const user: User = {
      id: 1,
      email: DEMO_CREDENTIALS.email,
      name: "Demo User",
    };
    
    // Store session in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "authenticated");
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
    
    return { success: true, user };
  }
  
  return { success: false };
}

/**
 * Sign out user
 */
export function signOut(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "authenticated";
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  
  const userStr = localStorage.getItem(USER_STORAGE_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

/**
 * Update user profile in localStorage
 */
export function updateUser(user: Partial<User>): void {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...user };
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    }
  }
}

