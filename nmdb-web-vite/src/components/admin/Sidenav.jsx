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

const adminRouteElement = [
  {
    title: "Dashboard",
    label: "DB",
    icon: Home,
    path: Paths.Route_Admin + Paths.Route_Admin_Dashboard,
  },
  {
    title: "Movie",
    icon: Video,
    path: Paths.Route_Admin + Paths.Route_Admin_Movie,
  },
  {
    title: "Crew",
    icon: Users,
    path: Paths.Route_Admin + Paths.Route_Admin_Crew,
  },
  {
    title: "Role",
    icon: BriefcaseBusiness,
    path: Paths.Route_Admin + Paths.Route_Admin_Role,
  },
  {
    title: "Production House",
    icon: Clapperboard,
    path: Paths.Route_Admin + Paths.Route_Admin_ProductionHouse,
  },
  {
    title: "Theatre",
    icon: Projector,
    path: Paths.Route_Admin + Paths.Route_Admin_Theatre,
  },
  {
    title: "Awards",
    icon: Award,
    path: Paths.Route_Admin + Paths.Route_Admin_Awards,
  },
  {
    title: "Scholarship",
    icon: GraduationCap,
    path: "",
    submenus: [
      {
        title: "Bachelors",
        icon: BookOpen,
        path: Paths.Route_Admin + "/scholarship/bachelors",
      },
      {
        title: "Masters",
        icon: BookText,
        path: Paths.Route_Admin + "/scholarship/masters",
      },
    ],
  },
];

const NavLinkCustom = ({
  path,
  title,
  label,
  closeNavOnTransistion,
  isSubLink,
  ...rest
}) => {
  return (
    (closeNavOnTransistion && (
      <SheetClose asChild>
        <NavLink
          to={path}
          className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-foreground hover:text-muted-foreground"
        >
          {<rest.icon className="h-6 w-6" />}
          {title}
          {label && (
            <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
              {label}
            </Badge>
          )}
        </NavLink>
      </SheetClose>
    )) || (
      <div className={cn(isSubLink && "ps-4")}>
        <NavLink
          to={path}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <rest.icon className="h-4 w-4" />
          {title}
          {label && (
            <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
              {label}
            </Badge>
          )}
        </NavLink>
      </div>
    )
  );
};

const NavLinkDropdown = ({
  title,
  label,
  submenus,
  closeNavOnTransistion,
  ...rest
}) => {
  const { checkActiveNav } = useCheckActiveNav();
  const isChildActive = !!submenus?.find((s) => checkActiveNav(s.path));
  return (
    <Collapsible defaultOpen={isChildActive}>
      <CollapsibleTrigger
        className={cn(
          "group w-full",
          (closeNavOnTransistion &&
            "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-foreground hover:text-foreground") ||
            " flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        )}
      >
        {
          <rest.icon
            className={cn(closeNavOnTransistion ? "h-6 w-6" : "h-4 w-4")}
          />
        }
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
                closeNavOnTransistion={closeNavOnTransistion}
              />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};

const Sidenav = ({ className, closeNavOnTransistion }) => {
  return (
    <nav className={cn("sidebar-nav grid", className)}>
      {adminRouteElement.map(
        ({ submenus, ...route }, index) =>
          (submenus && (
            <NavLinkDropdown
              key={route.title + index}
              {...route}
              submenus={submenus}
              closeNavOnTransistion={closeNavOnTransistion}
            />
          )) || (
            <NavLinkCustom
              key={route.title + index}
              {...route}
              closeNavOnTransistion={closeNavOnTransistion}
            />
          ),
      )}
    </nav>
  );
};

export default Sidenav;
