import { renderRoutes } from "./generate-route";
// Layouts
import DashboardLayout from "@/components/layouts/DashboardLayout";
import MainLayout from "@/components/layouts/MainLayout";

// Pages Landing
import Login from "@/components/landing/pages/auth/Login";
import Home from "@/components/landing/pages/home/Home";
import RegisterCrew from "@/components/landing/pages/auth/RegisterCrew";

// Pages Admin
import Movies from "@/components/admin/pages/movies/Movies";
import Crew from "@/components/admin/pages/crew/Crew";
import { Paths } from "@/constants/routePaths";
import VerifyEmail from "@/components/landing/pages/auth/VerifyEmail";
import Dashboard from "@/components/admin/pages/dashboard/Dashboard";
import Awards from "@/components/admin/pages/awards/Awards";
import Role from "@/components/admin/pages/role/Role";
import ProductionHouse from "@/components/admin/pages/productionHouse/ProductionHouse";
import Theatre from "@/components/admin/pages/theatre/Theatre";
import CreateProductionHouse from "@/components/admin/pages/productionHouse/CreateProductionHouse";
import AuthLayout from "@/components/layouts/AuthLayout";
import ForgotPassword from "@/components/landing/pages/auth/ForgotPassword";
import AddMovie from "@/components/admin/pages/movies/CreateMovie";
import Celebrities from "@/components/landing/pages/celebrities/Celebrities";
import CelebritiesDetails from "@/components/landing/pages/celebrities/CelebrityDetail";
import MovieDetail from "@/components/landing/pages/movies/MovieDetail";
import { default as MoviesHome } from "@/components/landing/pages/movies/Movies";
import CreateRole from "@/components/admin/pages/role/CreateRole";
import CreateTheatre from "@/components/admin/pages/theatre/CreateTheatre";
import CreateCrew from "@/components/admin/pages/crew/CreateCrew";
import CreateAward from "@/components/admin/pages/awards/CreateAward";

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
            routes: [
              {
                name: "movieAdd",
                title: "Movies Add page",
                component: AddMovie,
                path: Paths.Route_Admin_Movie_Add,
                isPublic: false,
              },
              {
                name: "movieEdit",
                title: "Movies Edit page",
                component: AddMovie,
                path: Paths.Route_Admin_Movie + "/:slug/edit",
                isPublic: false,
              },
              {
                name: "movieDetail",
                title: "Movies Detail page",
                component: AddMovie,
                path: Paths.Route_Admin_Movie + "/:slug",
                isPublic: false,
              },
            ],
          },
          {
            name: "crew",
            title: "Crew page",
            component: Crew,
            path: Paths.Route_Admin_Crew,
            isPublic: false,
            routes: [
              {
                name: "CrewAdd",
                title: "Crew Add page",
                component: CreateCrew,
                path: Paths.Route_Admin_Crew_Add,
                isPublic: false,
              },
              {
                name: "CrewEdit",
                title: "Crew Edit page",
                component: CreateCrew,
                path: Paths.Route_Admin_Crew + "/:slug/edit",
                isPublic: false,
              },
              {
                name: "CrewDetail",
                title: "Crew Detail page",
                component: CreateCrew,
                path: Paths.Route_Admin_Crew + "/:slug",
                isPublic: false,
              },
            ],
          },
          {
            name: "role",
            title: "Role page",
            component: Role,
            path: Paths.Route_Admin_Role,
            isPublic: false,
            routes: [
              {
                name: "RoleAdd",
                title: "Role Add page",
                component: CreateRole,
                path: Paths.Route_Admin_Role_Add,
                isPublic: false,
              },
              {
                name: "RoleEdit",
                title: "Role Edit page",
                component: CreateRole,
                path: Paths.Route_Admin_Role + "/:slug/edit",
                isPublic: false,
              },
              {
                name: "RoleDetail",
                title: "Role Detail page",
                component: CreateRole,
                path: Paths.Route_Admin_Role + "/:slug",
                isPublic: false,
              },
            ],
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
                component: CreateProductionHouse,
                path: Paths.Route_Admin_ProductionHouse_Add,
                isPublic: false,
              },
              {
                name: "productionHouseEdit",
                title: "Production House Edit page",
                component: CreateProductionHouse,
                path: Paths.Route_Admin_ProductionHouse + "/:slug/edit",
                isPublic: false,
              },
              {
                name: "productionHouseDetail",
                title: "Production House Detail page",
                component: CreateProductionHouse,
                path: Paths.Route_Admin_ProductionHouse + "/:slug",
                isPublic: false,
              },
            ],
          },
          {
            name: "theatre",
            title: "Theatre page",
            component: Theatre,
            path: Paths.Route_Admin_Theatre,
            isPublic: false,
            routes: [
              {
                name: "TheatreAdd",
                title: "Theatre Add page",
                component: CreateTheatre,
                path: Paths.Route_Admin_Theatre_Add,
                isPublic: false,
              },
              {
                name: "TheatreEdit",
                title: "Theatre Edit page",
                component: CreateTheatre,
                path: Paths.Route_Admin_Theatre + "/:slug/edit",
                isPublic: false,
              },
              {
                name: "TheatreDetail",
                title: "Theatre Detail page",
                component: CreateTheatre,
                path: Paths.Route_Admin_Theatre + "/:slug",
                isPublic: false,
              },
            ]
          },
          {
            name: "awards",
            title: "Awards Title",
            component: Awards,
            path: Paths.Route_Admin_Awards,
            isPublic: false,
            routes: [
              {
                name: "AwardsAdd",
                title: "Awards Add page",
                component: CreateAward,
                path: Paths.Route_Admin_Awards_Add,
                isPublic: false,
              },
              {
                name: "AwardsEdit",
                title: "Awards Edit page",
                component: CreateAward,
                path: Paths.Route_Admin_Awards + "/:slug/edit",
                isPublic: false,
              },
              {
                name: "AwardsDetail",
                title: "Awards Detail page",
                component: CreateAward,
                path: Paths.Route_Admin_Awards + "/:slug",
                isPublic: false,
              },
            ]
          },

          // {
          //   name: "Scholarship",
          //   title: "Scholarship",
          //   component: ScholarshipBachelors,
          //   path: Paths.Route_Admin_Scholarship,
          //   isPublic: false,
          //   routes: [
          //     {
          //       name: "Scholarship Bachelors",
          //       title: "Scholarship Bachelors",
          //       component: ScholarshipBachelors,
          //       path: Paths.Route_Admin_Scholarship_Bachelors,
          //       isPublic: false,
          //     },
          //     {
          //       name: "Scholarship Masters",
          //       title: "Scholarship Masters",
          //       component: ScholarshipMasters,
          //       path: Paths.Route_Admin_Scholarship_Masters,
          //       isPublic: false,
          //     },
          //   ],
          // },
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
        name: "celebrities",
        title: "Celebrities page",
        component: Celebrities,
        path: Paths.Route_Celebrities,
        isPublic: true,
        routes: [
          {
            name: "celebrities detail",
            title: "Celebrities Detail page",
            component: CelebritiesDetails,
            path: Paths.Route_Celebrity_Detail,
            isPublic: true,
          },
        ],
      },
      {
        name: "movies",
        title: "Movies page",
        component: MoviesHome,
        path: Paths.Route_Movies,
        isPublic: true,
        routes: [
          {
            name: "movie detail",
            title: "Movie Detail page",
            component: MovieDetail,
            path: Paths.Route_Movie_Detail,
            isPublic: true,
          },
        ],
      },
    ],
  },
  {
    layout: AuthLayout,
    routes: [
      {
        name: "login",
        title: "Login page",
        component: Login,
        path: Paths.Route_Login,
        isPublic: true,
      },
      {
        name: "registerCrew",
        title: "Register Crew",
        component: RegisterCrew,
        path: Paths.Route_Register_Crew,
        isPublic: true,
      },
      {
        name: "verify-email",
        title: "Verify page",
        component: VerifyEmail,
        path: Paths.Route_Verify_Email,
        isPublic: true,
      },
      {
        name: "forgot-password",
        title: "Forgot password page",
        component: ForgotPassword,
        path: Paths.Route_Forogot_Password,
        isPublic: true,
      },
    ],
  },
];

export const Routes = renderRoutes(routes);
