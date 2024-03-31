import { NavLink, Outlet } from "react-router-dom";
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";

const DashboardLayout = () => {
  return (
      <div className="relative flex min-h-screen flex-col bg-background">
          <div className="w-full h-full theme-zinc">
              <div className="grid min-h-screen w-full ">
                <aside className="fixed inset-y-0 left-0 z-10 hidden md:w-64 lg:w-72  border-r bg-muted/40 md:block">
                  <div className="flex h-full overflow-y-auto flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                      <a href="/" className="flex items-center gap-2 font-semibold">
                        <Package2 className="h-6 w-6" />
                        <span className="">NMDB Dashboard</span>
                      </a>
                      <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Toggle notifications</span>
                      </Button>
                    </div>
                    <div className="flex-1">
                      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <NavLink
                          to="/admin/movies"
                          className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                          <Home className="h-4 w-4" />
                          Movies
                        </NavLink>
                        <NavLink
                          to="/admin/crew"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <ShoppingCart className="h-4 w-4" />
                          Crew
                          <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                            6
                          </Badge>
                        </NavLink>
                        <a
                          href="#"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary"
                        >
                          <Package className="h-4 w-4" />
                          Prduction House{" "}
                        </a>
                        <a
                          href="#"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                          <Users className="h-4 w-4" />
                          Theater
                        </a>
                        <a
                          href="#"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                          <LineChart className="h-4 w-4" />
                          Role
                        </a>
                      </nav>
                    </div>
                  </div>
                </aside>
                <div className="flex flex-col md:pl-64 lg:pl-72">
                  <header className="sticky inset-y-0 left-72 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="shrink-0 md:hidden"
                        >
                          <Menu className="h-5 w-5" />
                          <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="flex flex-col">
                        <nav className="grid gap-2 text-lg font-medium">
                          <a
                            href="#"
                            className="flex items-center gap-2 text-lg font-semibold"
                          >
                            <Package2 className="h-6 w-6" />
                            <span className="sr-only">NMDB Dashboard</span>
                          </a>
                          <a
                            href="#"
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                          >
                            <Home className="h-5 w-5" />
                            Dashboard
                          </a>
                          <a
                            href="#"
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                          >
                            <ShoppingCart className="h-5 w-5" />
                            Orders
                            <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                              6
                            </Badge>
                          </a>
                          <a
                            href="#"
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                          >
                            <Package className="h-5 w-5" />
                            Products
                          </a>
                          <a
                            href="#"
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                          >
                            <Users className="h-5 w-5" />
                            Customers
                          </a>
                          <a
                            href="#"
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                          >
                            <LineChart className="h-5 w-5" />
                            Analytics
                          </a>
                        </nav>
                        <div className="mt-auto">
                          <Card>
                            <CardHeader>
                              <CardTitle>Upgrade to Pro</CardTitle>
                              <CardDescription>
                                Unlock all features and get unlimited access to our
                                support team.
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button size="sm" className="w-full">
                                Upgrade
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                      <form>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search ..."
                            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                          />
                        </div>
                      </form>
                    </div>
                    <ModeToggle></ModeToggle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="rounded-full"
                        >
                          <CircleUser className="h-5 w-5" />
                          <span className="sr-only">Toggle user menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Logout</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </header>
                  <Outlet />
                </div>
              </div>
          </div>
      </div>
  );
};

export default DashboardLayout;
