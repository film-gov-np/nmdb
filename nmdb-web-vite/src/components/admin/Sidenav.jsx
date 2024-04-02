import {
  BookOpen,
  BookText,
  ChevronDown,
  GraduationCap,
  Home,
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
    Icon: <Home className="h-4 w-4" />,
    path: Paths.Route_Admin + Paths.Route_Admin_Dashboard,
  },
  {
    title: "Movie",
    Icon: <Video className="h-4 w-4" />,
    path: Paths.Route_Admin + Paths.Route_Admin_Movie,
  },
  {
    title: "Crew",
    Icon: <Users className="h-4 w-4" />,
    path: Paths.Route_Admin + Paths.Route_Admin_Crew,
  },
  {
    title: "Scholarship",
    Icon: <GraduationCap className="h-4 w-4" />,
    path: "",
    submenus: [
      {
        title: "Bachelors",
        Icon: <BookOpen className="h-4 w-4" />,
        path: Paths.Route_Admin + "/scholarship/bachelors",
      },
      {
        title: "Masters",
        Icon: <BookText className="h-4 w-4" />,
        path: Paths.Route_Admin + "/scholarship/masters",
      },
    ],
  },
];

const NavLinkCustom = ({
  path,
  Icon,
  title,
  label,
  closeNavOnTransistion,
  isSubLink,
}) => {
  return (
    (closeNavOnTransistion && (
      <SheetClose asChild>
        <NavLink
          to={path}
          className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-foreground hover:text-muted-foreground"
        >
          {Icon}
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
          {Icon}
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
  Icon,
  label,
  submenus,
  closeNavOnTransistion,
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
            " flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        )}
      >
        {Icon}
        {title}
        {label && (
          <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
            {label}
          </Badge>
        )}
        <span
          className={cn(
            "ml-auto transition-all group-data-[state='open']:-rotate-180"
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
    <nav className={cn("grid", className)}>
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
          )
      )}
    </nav>
  );
};

export default Sidenav;
