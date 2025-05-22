
import { User } from "@/types/auth";

// Usuários fixos do sistema
export const predefinedUsers: User[] = [
  { 
    id: 1, 
    username: "admin", 
    email: "admin@example.com", 
    isActive: true,
    role: "admin"
  },
  { 
    id: 2, 
    username: "user", 
    email: "user@example.com", 
    isActive: true,
    role: "user"
  },
];

// Credenciais para os usuários fixos
export const userCredentials: Record<string, string> = {
  admin: "admin123", // Senha para o usuário admin
  user: "password",  // Senha para o usuário regular
};

// Função para verificar credenciais
export const verifyCredentials = (username: string, password: string): User | null => {
  // Verificar se o username existe nos usuários predefinidos
  const user = predefinedUsers.find(u => u.username === username);
  
  // Se o usuário existe e a senha está correta
  if (user && userCredentials[username] === password) {
    return user;
  }
  
  return null;
};
