import {
  Award,
  BookOpen,
  BookText,
  BriefcaseBusiness,
  ChevronDown,
  Clapperboard,
  GraduationCap,
  Home,
  Projector,
  User,
  Users,
  Video,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Paths } from "@/constants/routePaths";
import { SheetClose } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import useCheckActiveNav from "@/hooks/useCheckActiveNav";
import { cn } from "@/lib/utils";
import { useAuthContext } from "./context/AuthContext";
import { CardStackIcon } from "@radix-ui/react-icons";

const adminRouteElement = [
  {
    title: "Dashboard",
    // label: "DB",
    icon: Home,
    path: Paths.Route_Admin_Dashboard,
  },
  {
    title: "Movie",
    icon: Video,
    path: Paths.Route_Admin_Movie,
  },
  {
    title: "Crew",
    icon: Users,
    path: Paths.Route_Admin_Crew,
  },
  {
    title: "Role",
    icon: BriefcaseBusiness,
    path: Paths.Route_Admin_Role,
  },
  {
    title: "Production House",
    icon: Clapperboard,
    path: Paths.Route_Admin_ProductionHouse,
  },
  {
    title: "Theatre",
    icon: Projector,
    path: Paths.Route_Admin_Theatre,
  },
  {
    title: "Awards",
    icon: Award,
    path: Paths.Route_Admin_Awards,
  },
  {
    title: "Users",
    icon: User,
    path: Paths.Route_Admin_User,
    roles: ["Admin", "Superadmin"],
  },
  {
    title: "Card Request",
    icon: CardStackIcon,
    path: Paths.Route_Admin_Card_Request,
  },
  // {
  //   title: "Scholarship",
  //   icon: GraduationCap,
  //   path: "",
  //   submenus: [
  //     {
  //       title: "Bachelors",
  //       icon: BookOpen,
  //       path: Paths.Route_Admin_Scholarship_Bachelors,
  //     },
  //     {
  //       title: "Masters",
  //       icon: BookText,
  //       path: Paths.Route_Admin_Scholarship_Masters,
  //     },
  //   ],
  // },
];

const NavLinkCustom = ({
  path,
  title,
  label,
  isMobileSidebar,
  isSubLink,
  setOpen,
  ...rest
}) => {
  return (
    <div className={cn(isSubLink && "ps-4")}>
      <NavLink
        to={path}
        onClick={() => {
          isMobileSidebar && setOpen(false);
        }}
        className={cn(
          isMobileSidebar && "mx-[-0.65rem] gap-4",
          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        )}
      >
        <rest.icon className={cn(isMobileSidebar ? "h-6 w-6" : "h-4 w-4")} />
        {title}
        {label && (
          <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
            {label}
          </Badge>
        )}
      </NavLink>
    </div>
  );
};

const NavLinkDropdown = ({
  title,
  label,
  submenus,
  isMobileSidebar,
  setOpen,
  ...rest
}) => {
  const { checkActiveNav } = useCheckActiveNav();
  const isChildActive = !!submenus?.find((s) => checkActiveNav(s.path));
  return (
    <Collapsible defaultOpen={isChildActive}>
      <CollapsibleTrigger
        className={cn(
          "group w-full",
          (isMobileSidebar &&
            "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground") ||
            " flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
        )}
      >
        {<rest.icon className={cn(isMobileSidebar ? "h-6 w-6" : "h-4 w-4")} />}
        {title}
        {label && (
          <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
            {label}
          </Badge>
        )}
        <span
          className={cn(
            "ml-auto transition-all group-data-[state='open']:-rotate-180",
          )}
        >
          <ChevronDown className=" h-4 w-4" />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul>
          {submenus?.map((sublink) => (
            <li key={sublink.title} className="my-1 ml-6">
              <NavLinkCustom
                {...sublink}
                isMobileSidebar={isMobileSidebar}
                setOpen={setOpen}
              />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};

const Sidenav = ({ className, isMobileSidebar, setOpen }) => {
  const { isAuthorized, userInfo } = useAuthContext();
  return (
    <nav className={cn("sidebar-nav grid", className)}>
      {adminRouteElement.map(
        ({ submenus, ...route }, index) =>
          (submenus && (
            <NavLinkDropdown
              key={route.title + index}
              {...route}
              submenus={submenus}
              isMobileSidebar={isMobileSidebar}
              setOpen={setOpen}
            />
          )) || (
            <NavLinkCustom
              key={route.title + index}
              {...route}
              isMobileSidebar={isMobileSidebar}
              setOpen={setOpen}
            />
          ),
      )}
    </nav>
  );
};

export default Sidenav;
