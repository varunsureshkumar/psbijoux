import { Link } from "wouter";
import { ShoppingBag, Search, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { categories } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { CartDrawer } from "../cart/CartDrawer";

export function Header() {
  const { user, logoutMutation } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80vw] sm:w-[350px]">
            <nav className="flex flex-col gap-4">
              {categories.map((category) => (
                <Link key={category} href={`/category/${category.toLowerCase()}`}>
                  <a className="text-lg font-medium hover:text-primary transition-colors">
                    {category}
                  </a>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex md:flex-1">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <span className="font-bold text-xl hidden sm:inline">PS Bijoux</span>
              <span className="font-bold text-xl sm:hidden">PSB</span>
            </a>
          </Link>
          <nav className="hidden md:ml-6 md:flex md:items-center md:space-x-4 lg:space-x-6">
            {categories.map((category) => (
              <Link key={category} href={`/category/${category.toLowerCase()}`}>
                <a className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  {category}
                </a>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden sm:block w-full md:w-auto md:flex-1">
            <Input
              placeholder="Search products..."
              className="h-9 md:w-[200px] lg:w-[300px]"
            />
          </div>
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {user ? (
            <>
              <CartDrawer />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/orders">
                    <DropdownMenuItem className="cursor-pointer">
                      Orders
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => logoutMutation.mutate()}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/auth">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                Login
              </Button>
              <Button variant="ghost" size="icon" className="sm:hidden">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}