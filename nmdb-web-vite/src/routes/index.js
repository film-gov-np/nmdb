import { renderRoutes } from "./generate-route";
// Layouts
import DashboardLayout from "@/components/layouts/DashboardLayout";
import MainLayout from "@/components/layouts/MainLayout";

// Pages Landing
import Login from "@/components/landing/pages/Login";
import Home from "@/components/landing/pages/Home";

// Pages Admin
import Movies from "@/components/admin/pages/movies/Movies";
import Crew from "@/components/admin/pages/crew/Crew";
import ScholarshipBachelors from "@/components/admin/pages/scholarship/Bachelors";
import ScholarshipMasters from "@/components/admin/pages/scholarship/Masters";
import { Paths } from "@/constants/routePaths";
import Register from "@/components/landing/register";
import VerifyEmail from "@/components/landing/verify/VerifyEmail";
import Dashboard from "@/components/admin/pages/dashboard/Dashboard";
import Awards from "@/components/admin/pages/awards/Awards";
import Role from "@/components/admin/pages/role/Role";
import ProductionHouse from "@/components/admin/pages/productionHouse/ProductionHouse";
import Theatre from "@/components/admin/pages/theatre/Theatre";
import AddProductionHouse from "@/components/admin/pages/productionHouse/AddProductionHouse";

export const routes = [
  {
    layout: DashboardLayout,
    routes: [
      {
        name: "admin",
        title: "Dasboard",
        component: Dashboard,
        path: Paths.Route_Admin,
        isPublic: false,
        routes: [
          {
            name: "dashboard",
            title: "Dashboard page",
            component: Dashboard,
            path: Paths.Route_Admin_Dashboard,
            isPublic: false,
          },
          {
            name: "movie",
            title: "Movies page",
            component: Movies,
            path: Paths.Route_Admin_Movie,
            isPublic: false,
          },
          {
            name: "crew",
            title: "Crew page",
            component: Crew,
            path: Paths.Route_Admin_Crew,
            isPublic: false,
          },
          {
            name: "role",
            title: "Role page",
            component: Role,
            path: Paths.Route_Admin_Role,
            isPublic: false,
          },
          {
            name: "productionHouse",
            title: "Production House page",
            component: ProductionHouse,
            path: Paths.Route_Admin_ProductionHouse,
            isPublic: false,
            routes: [
              {
                name: "productionHouseAdd",
                title: "Production House Add page",
                component: AddProductionHouse,
                path: Paths.Route_Admin_ProductionHouse_Add,
                isPublic: false,
              }
            ]
          },
          {
            name: "theatre",
            title: "Theatre page",
            component: Theatre,
            path: Paths.Route_Admin_Theatre,
            isPublic: false,
          },
          {
            name: "awards",
            title: "Awards Title",
            component: Awards,
            path: Paths.Route_Admin_Awards,
            isPublic: false,
          },
          {
            name: "Scholarship",
            title: "Scholarship",
            component: ScholarshipBachelors,
            path: "/scholarship",
            isPublic: false,
            routes: [
              {
                name: "Scholarship Bachelors",
                title: "Scholarship Bachelors",
                component: ScholarshipBachelors,
                path: "/bachelors",
                isPublic: false,
              },
              {
                name: "Scholarship Masters",
                title: "Scholarship Masters",
                component: ScholarshipMasters,
                path: "/masters",
                isPublic: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    layout: MainLayout,
    routes: [
      {
        name: "home",
        title: "Home page",
        component: Home,
        path: Paths.Route_Home,
        isPublic: true,
      },
      {
        name: "login",
        title: "Login page",
        component: Login,
        path: Paths.Route_Login,
        isPublic: true,
      },
      {
        name: "register",
        title: "Register page",
        component: Register,
        path: Paths.Route_Register,
        isPublic: true,
      },
      {
        name: "verifyemail",
        title: "Verify page",
        component: VerifyEmail,
        path: Paths.Route_Verify_Email,
        isPublic: true,
      },
    ],
  },
];

export const Routes = renderRoutes(routes);
