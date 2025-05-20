
export interface User {
  id: number;
  username: string;
  email?: string;
  isActive: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
