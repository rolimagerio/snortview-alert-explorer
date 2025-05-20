
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link to="/" className="flex items-center font-semibold text-lg mr-4">
          SnortView
        </Link>
        <NavigationMenu className="mr-4">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/search" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Busca Detalhada
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center space-x-4">
          {user && (
            <>
              <span className="text-sm text-muted-foreground">
                Olá, {user.username}
              </span>
              <Button variant="outline" onClick={logout}>
                Sair
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
