import { NavLink } from "react-router-dom";
import "./App.css";
import { Paths } from "./constants/routePaths";

const menuRoutes = [
  {
    title: "home",
    to: Paths.Route_Home,
  },
  {
    title: "Login",
    to: Paths.Route_Login,
  },
  {
    title: "Register",
    to: Paths.Route_Register,
  },
  {
    title: "Movies",
    to: Paths.Route_Movies,
  },
  {
    title: "About Us",
    to: Paths.Route_Aboutus,
  },
  {
    title: "Dashboard",
    to: "/admin/dashboard",
  },
  {
    title: "Movie",
    to: "/admin/movie",
  },
];
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Film Department Board of Nepal</p>
        <span>Nepali Movie Database</span>
        <ul>
          {menuRoutes.map((menu, index) => {
            const { title, to } = menu;
            return (
              <li key={"menu-" + index}>
                <NavLink to={to}>{title}</NavLink>
              </li>
            );
          })}
        </ul>
      </header>
    </div>
  );
}

export default App;
