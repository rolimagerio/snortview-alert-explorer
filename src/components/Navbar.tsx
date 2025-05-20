
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
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
                <span>Usuário</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/login">Sair</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
