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
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
import { useAuthContext } from "../admin/context/AuthContext";
import { useState } from "react";
import GlobalList from "../landing/pages/home/GlobalList";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import axiosInstance from "@/helpers/axiosSetup";
import { ApiPaths } from "@/constants/apiPaths";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// const useNavigationListener = (onNavigateAway) => {
//   const location = useLocation();
//   const prevLocation = useRef(location);

//   useEffect(() => {
//     if (prevLocation.current.pathname !== location.pathname) {
//       // Navigation has occurred
//       onNavigateAway();
//     }

//     // Update previous location to the current location
//     prevLocation.current = location;
//   }, [location, onNavigateAway]);
// };

const MainLayout = () => {
  const { isAuthorized, userInfo, setIsAuthorized } = useAuthContext();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [searchGlobal, setSearchGlobal] = useState("");
  const debouncedGlobalSearchTerm = useDebouncedState(searchGlobal, 500);
  // useNavigationListener(() => {
  //   setSearchGlobal("");
  // });
  const resetGlobalSearch = () => {
    setSearchGlobal("");
  };

  const logOutFromServer = () => {
    axiosInstance.post(ApiPaths.Path_Session).then((resp) => {
      setIsAuthorized(false);
      navigate(Paths.Route_Home);
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className=" theme-zinc h-full w-full">
        <div className="flex min-h-screen w-full flex-col">
          <header className="sticky top-0 z-10 grid h-16 grid-flow-col items-center gap-4 border-b bg-background px-4 md:px-6">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex-row md:items-center md:gap-5 md:text-sm lg:flex lg:gap-6">
              <NavLink
                to="/"
                onClick={resetGlobalSearch}
                className="flex items-center gap-2 text-lg font-semibold md:text-base"
              >
                <Package2 className="h-6 w-6" />
                <span>NMDB</span>
                <span className="sr-only">NMDB</span>
              </NavLink>
            </nav>
            <Sheet open={open} onOpenChange={setOpen}>
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
                    to={Paths.Route_Home}
                    onClick={() => {
                      resetGlobalSearch();
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 text-lg font-semibold"
                  >
                    <Package2 className="h-6 w-6" />
                    <span className="sr-only">Acme Inc</span>
                  </NavLink>
                  <NavLink
                    to={Paths.Route_Home}
                    onClick={() => {
                      resetGlobalSearch();
                      setOpen(false);
                    }}
                    className="flex items-center text-muted-foreground hover:text-foreground"
                  >
                    <HomeIcon className="mr-2 h-4 w-4" />
                    Home
                  </NavLink>
                  <NavLink
                    to={Paths.Route_Movies}
                    onClick={() => {
                      resetGlobalSearch();
                      setOpen(false);
                    }}
                    className="flex items-center text-muted-foreground hover:text-foreground"
                  >
                    <Film className="mr-2 h-4 w-4" />
                    Movies
                  </NavLink>
                  <NavLink
                    to={Paths.Route_Celebrities}
                    onClick={() => {
                      resetGlobalSearch();
                      setOpen(false);
                    }}
                    className="flex items-center text-muted-foreground hover:text-foreground"
                  >
                    <Drama className="mr-2 h-4 w-4" />
                    Celebrities
                  </NavLink>
                  <NavLink
                    to={Paths.Route_MovieCalendar}
                    onClick={() => {
                      resetGlobalSearch();
                      setOpen(false);
                    }}
                    className="flex items-center text-muted-foreground hover:text-foreground"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Movie Calendar
                  </NavLink>
                  <NavLink
                    to={Paths.Route_CinemaHalls}
                    onClick={() => {
                      resetGlobalSearch();
                      setOpen(false);
                    }}
                    className="flex items-center text-muted-foreground hover:text-foreground"
                  >
                    <Theater className="mr-2 h-4 w-4" />
                    Cinema Hall
                  </NavLink>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="nav-container hidden grid-flow-col lg:grid">
              <NavLink
                to={Paths.Route_Home}
                onClick={resetGlobalSearch}
                className="w-fit rounded-md"
              >
                <Button variant="ghost">
                  <HomeIcon className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </NavLink>
              <NavLink
                to={Paths.Route_Movies}
                onClick={resetGlobalSearch}
                className="w-fit rounded-md"
              >
                <Button variant="ghost">
                  <Film className="mr-2 h-4 w-4" />
                  Movies
                </Button>
              </NavLink>
              <NavLink
                to={Paths.Route_Celebrities}
                onClick={resetGlobalSearch}
                className="w-fit rounded-md"
              >
                <Button variant="ghost">
                  <Drama className="mr-2 h-4 w-4" />
                  Celebrities
                </Button>
              </NavLink>
              <NavLink
                to={Paths.Route_MovieCalendar}
                onClick={resetGlobalSearch}
                className="w-fit rounded-md"
              >
                <Button variant="ghost">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Movie Calendar
                </Button>
              </NavLink>
              <NavLink
                to={Paths.Route_CinemaHalls}
                onClick={resetGlobalSearch}
                className="w-fit rounded-md"
              >
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
                    value={searchGlobal}
                    onChange={(e) => {
                      setSearchGlobal(e.target.value);
                      // setCurrentPage(1);
                    }}
                    placeholder="Search ..."
                    className="pl-8 sm:w-[100px] md:w-[150px] lg:w-[200px] xl:w-[250px]"
                  />
                </div>
              </form>
              {!isAuthorized && (
                <NavLink to="login">
                  <Button variant={"outline"}>Sign In</Button>
                </NavLink>
              )}

              {isAuthorized && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full"
                    >
                      <Avatar className="flex h-8 w-8 text-center">
                        <AvatarImage
                          src={userInfo.profilePhotoUrl}
                          alt="Avatar"
                        />
                        <AvatarFallback>
                          <CircleUser className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="sr-only">Toggle user menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <NavLink
                        className={"hover:underline"}
                        to={
                          Paths.Route_Admin_User + "/" + userInfo.id + "/edit"
                        }
                      >
                        <div className="flex flex-col items-center justify-center ">
                          <p className=" text-muted-foreground">
                            {userInfo.name}
                          </p>
                          <p className=" text-muted-foreground">
                            {userInfo.email}
                          </p>
                        </div>
                      </NavLink>
                    </DropdownMenuLabel>
                    {userInfo.isCrew && (
                      <DropdownMenuItem asChild>
                        <NavLink
                          to={Paths.Route_Celebrities + "/" + userInfo.crewId}
                        >
                          My Celebrity Page
                        </NavLink>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {(userInfo.role === "Admin" ||
                      userInfo.role === "Superadmin") && (
                      <DropdownMenuItem asChild>
                        <NavLink to={Paths.Route_Admin_Dashboard}>
                          Dashboard
                        </NavLink>
                      </DropdownMenuItem>
                    )}
                    {/* <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem> */}
                    <DropdownMenuItem className="flex justify-between gap-2">
                      Theme<ModeToggle></ModeToggle>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logOutFromServer}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </header>
          {debouncedGlobalSearchTerm ? (
            <GlobalList search={debouncedGlobalSearchTerm} />
          ) : (
            <Outlet />
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
