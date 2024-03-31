import { renderRoutes } from "./generate-route";
// Layouts
import DashboardLayout from "@/components/layouts/DashboardLayout";
import MainLayout from "@/components/layouts/MainLayout";

// Pages Landing
import Login from "@/components/landing/pages/Login";
import Home from "@/components/landing/pages/Home";

// Pages Admin
import Movies from "@/components/admin/pages/Movies";
import Crew from "@/components/admin/pages/Crew";

export const routes = [
  {
    layout: DashboardLayout,
    routes: [
      {
        name: "movies",
        title: "Movies page",
        component: Movies,
        path: "admin/movies",
        isPublic: false,
      },
    ],
  },
  {
    layout: DashboardLayout,
    routes: [
      {
        name: "movies",
        title: "Movies page",
        component: Movies,
        path: "admin/",
        isPublic: false,
      },
    ],
  },
  {
    layout: DashboardLayout,
    routes: [
      {
        name: "crew",
        title: "Crew page",
        component: Crew,
        path: "admin/crew",
        isPublic: false,
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
        path: "/",
        isPublic: true,
      },
    ],
  },
  {
    layout: MainLayout,
    routes: [
      {
        name: "login",
        title: "Login page",
        component: Login,
        path: "/login",
        isPublic: true,
      },
    ],
  },
];

export const Routes = renderRoutes(routes);
