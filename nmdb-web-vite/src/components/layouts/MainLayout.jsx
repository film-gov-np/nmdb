import {
  CalendarDays,
  CircleUser,
  Drama,
  Film,
  Menu,
  Package2,
  Search,
  Theater,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ModeToggle } from "../mode-toggle";
import Footer from "../landing/Footer";
import { HomeIcon } from "@radix-ui/react-icons";
import { Paths } from "@/constants/routePaths";

const MainLayout = () => {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className=" theme-zinc h-full w-full">
        <div className="flex min-h-screen w-full flex-col">
          <header className="sticky top-0 z-10 grid grid-flow-col h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <nav className="hidden flex-col gap-6 text-lg font-medium lg:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
              <NavLink
                to="/"
                className="flex items-center gap-2 text-lg font-semibold md:text-base"
              >
                <Package2 className="h-6 w-6" />
                <span>NMDB</span>
                <span className="sr-only">NMDB</span>
              </NavLink>
            </nav>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium">
                  <NavLink
                    to="#"
                    className="flex items-center gap-2 text-lg font-semibold"
                  >
                    <Package2 className="h-6 w-6" />
                    <span className="sr-only">Acme Inc</span>
                  </NavLink>
                  <NavLink
                    to="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Orders
                  </NavLink>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="hidden lg:grid grid-flow-col nav-container">
              <NavLink to={Paths.Route_Home} className="w-fit rounded-md">
                <Button variant="ghost" >
                  <HomeIcon className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </NavLink>
              <NavLink to={Paths.Route_Movies} className="w-fit rounded-md">
                <Button variant="ghost">
                  <Film className="mr-2 h-4 w-4" />
                  Movies
                </Button>
              </NavLink>
              <NavLink to={Paths.Route_Celebrities} className="w-fit rounded-md">
                <Button variant="ghost">
                  <Drama className="mr-2 h-4 w-4" />
                  Celebrities
                </Button>
              </NavLink>
              <NavLink to="#" className="w-fit rounded-md">
                <Button variant="ghost">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Movie Calendar
                </Button>
              </NavLink>
              <NavLink to="#" className="w-fit rounded-md">
                <Button variant="ghost">
                  <Theater className="mr-2 h-4 w-4" />
                  Cinema Hall
                </Button>
              </NavLink>
            </div>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
              <form className="ml-auto flex-1 sm:flex-initial">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search ..."
                    className="pl-8 sm:w-[100px] md:w-[150px] lg:w-[200px] xl:w-[250px]"
                  />
                </div>
              </form>
              <NavLink to="login">
                <Button variant={"outline"}>Sign In</Button>
              </NavLink>
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
                  <DropdownMenuItem className="flex gap-2">
                  Theme<ModeToggle></ModeToggle>
                </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
