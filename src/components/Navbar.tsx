
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Database } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="font-semibold text-lg">
            SnortView
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-sm font-medium hover:underline">
              Dashboard
            </Link>
            <Link to="/search" className="text-sm font-medium hover:underline">
              Busca Detalhada
            </Link>
            <Link to="/users" className="text-sm font-medium hover:underline">
              Usuários
            </Link>
            {user?.role === 'admin' && (
              <Link to="/database-config" className="text-sm font-medium hover:underline">
                <span className="flex items-center gap-1">
                  <Database size={16} />
                  Configurar Banco
                </span>
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="relative h-8 rounded-full"
              >
                <span>{user?.username || "Usuário"}</span>
                {user?.role === 'admin' && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user?.role === 'admin' && (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/register">Cadastrar Usuário</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/users">Gerenciar Usuários</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/database-config">Configurar Banco</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={logout}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
