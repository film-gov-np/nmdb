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
import Sidenav from "@/components/admin/Sidenav";
import { BreadcrumbResponsive } from "@/components/admin/Breadcrumb";
import { Paths } from "@/constants/routePaths";

const DashboardLayout = () => {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="w-full h-full theme-zinc">
        <div className="grid min-h-screen w-full ">
          <aside className="fixed inset-y-0 left-0 z-10 hidden md:w-64 lg:w-72  border-r bg-muted/40 md:block">
            <div className="flex h-full overflow-y-auto flex-col gap-2">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <NavLink to={Paths.Route_Admin} className="flex items-center gap-2 font-semibold">
                  <Package2 className="h-6 w-6" />
                  <span className="">NMDB Dashboard</span>
                </NavLink>
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto h-8 w-8"
                >
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Toggle notifications</span>
                </Button>
              </div>
              <div className="flex-1">
                <Sidenav className="items-start px-2 text-sm font-medium lg:px-4" />
              </div>
              <div className="mt-auto p-4">
                    <Card>
                      <CardHeader className="p-2 pt-0 md:p-4">
                        <CardTitle className="text-xl"> Film Development Board</CardTitle>
                        <CardDescription>
                          @{new Date().getFullYear()} All Rights Reserved
                        </CardDescription>
                      </CardHeader>
                    </Card>
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
                  <a
                    href="#"
                    className="mx-[-0.65rem] flex items-center gap-2 ps-2 text-lg font-semibold"
                  >
                    <Package2 className="h-6 w-6" />
                    <span className="sr-only">NMDB Dashboard</span>
                  </a>
                  <Sidenav
                    className="gap-2 text-lg font-medium"
                    closeNavOnTransistion={true}
                  />

                  <div className="mt-auto">
                    <Card>
                      <CardHeader>
                        <CardTitle> Film Development Board</CardTitle>
                        <CardDescription>
                          @{new Date().getFullYear()} All Rights Reserved
                        </CardDescription>
                      </CardHeader>
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
            <div className="px-4 pt-2 lg:px-6 lg:pt-4"><BreadcrumbResponsive/></div>
            <Outlet />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
