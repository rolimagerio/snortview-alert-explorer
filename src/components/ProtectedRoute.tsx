
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Se ainda estiver verificando se o usuário está logado, mostra nada
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  // Se não estiver logado, redireciona para a página de login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Se estiver logado, mostra o conteúdo protegido
  return <>{children}</>;
}
