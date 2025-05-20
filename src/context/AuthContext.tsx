
import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContextType, User } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll accept any username/password where password is "password"
      if (password !== "password") {
        toast({
          title: "Erro de autenticação",
          description: "Nome de usuário ou senha incorretos",
          variant: "destructive",
        });
        return false;
      }

      const user: User = { id: 1, username, isActive: true };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo, ${username}!`,
      });
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erro de login",
        description: "Ocorreu um erro durante o login. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
    toast({
      title: "Logout realizado",
      description: "Você saiu com sucesso do sistema",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
