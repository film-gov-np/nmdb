import { NavLink, Outlet } from "react-router-dom";
import { Bell, CircleUser, Menu, Package2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
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
import { ModeToggle } from "@/components/mode-toggle";
import Sidenav from "@/components/admin/Sidenav";
import { BreadcrumbResponsive } from "@/components/admin/Breadcrumb";
import { Paths } from "@/constants/routePaths";
import MobileSideBar from "../common/MobileSideBar";
import { useAuthContext } from "../admin/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/helpers/axiosSetup";
import { ApiPaths } from "@/constants/apiPaths";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { isAuthorized, userInfo, setIsAuthorized } = useAuthContext();
  const logOutFromServer = () => {
    axiosInstance.post(ApiPaths.Path_Session).then((resp) => {
      setIsAuthorized(false);
      navigate(Paths.Route_Home);
    });
  };
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="theme-zinc h-full w-full">
        <div className="grid min-h-screen w-full ">
          <aside className="fixed inset-y-0 left-0 z-10 hidden border-r bg-muted/40  md:block md:w-60 lg:w-64">
            <div className="flex h-full flex-col gap-2 overflow-y-auto">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <NavLink
                  to={Paths.Route_Admin}
                  className="flex items-center gap-2 font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="">NMDB Dashboard</span>
                </NavLink>
                {/* <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto h-8 w-8"
                >
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Toggle notifications</span>
                </Button> */}
              </div>
              <div className="flex-1">
                <Sidenav className="items-start px-2 text-sm font-medium lg:px-4" />
              </div>
              <div className="mt-auto p-4">
                <Card>
                  <CardHeader className="p-2 pt-0 md:p-4">
                    <CardTitle className="text-xl">
                      {" "}
                      Film Development Board
                    </CardTitle>
                    <CardDescription>
                      @{new Date().getFullYear()} All Rights Reserved
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </aside>
          <header className="fixed left-0 right-0 top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:left-60 lg:left-64 lg:h-[60px] lg:px-6">
            <MobileSideBar />
            {/* <div className="w-full flex-1">
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
            </div> */}
            <div className="w-full flex-1"></div>

            {isAuthorized && (<DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  {
                    <Avatar className="flex h-8 w-8 text-center">
                      <AvatarImage
                        src={userInfo.profilePhotoUrl}
                        alt="Avatar"
                      />
                      <AvatarFallback>
                        <CircleUser className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  }
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <NavLink
                    className={"hover:underline"}
                    to={Paths.Route_Admin_User + "/" + userInfo.id + "/edit"}
                  >
                    <div className="flex flex-col items-center justify-center ">
                      <p className=" text-muted-foreground">
                        {userInfo.firstName + " " + userInfo.lastName}
                      </p>
                      <p className=" text-muted-foreground">{userInfo.email}</p>
                    </div>
                  </NavLink>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NavLink to={Paths.Route_Home}>Visit Website</NavLink>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>Support</DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex gap-2">
                  Theme<ModeToggle></ModeToggle>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logOutFromServer();
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>)}
          </header>
          <div className="flex flex-col overflow-hidden pt-14 md:pl-60 lg:pl-64 lg:pt-[60px]">
            <div className="px-4 pt-2 lg:px-6 lg:pt-4">
              <BreadcrumbResponsive />
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
