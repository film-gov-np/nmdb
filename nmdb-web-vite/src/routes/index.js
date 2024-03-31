import { renderRoutes } from "./generate-route";
// Layouts
import DashboardLayout from "@/components/layouts/DashboardLayout";
import MainLayout from "@/components/layouts/MainLayout";

// Pages Landing
import Login from "../components/landing/Login";
import Home from "@/components/landing/Home";

// Pages Admin
import Movies from "@/components/admin/pages/Movies";
import Crew from "@/components/admin/pages/Crew";
import { Paths } from "@/constants/routePaths";
import Register from "@/components/landing/register";
import VerifyEmail from "@/components/landing/verify/VerifyEmail";

export const routes = [
  {
    layout: DashboardLayout,
    routes: [
      {
        name: "admin",
        title: "Dasboard",
        component: Movies,
        path: Paths.Route_Admin,
        isPublic: false,
        routes: [
          {
            name: "dashboard",
            title: "Movies page",
            component: Movies,
            path: Paths.Route_Admin_Dashboard,
            isPublic: false,
          },
          {
            name: "movies",
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
