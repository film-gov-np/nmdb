import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Paths } from "./constants/routePaths";
import App from "./App";
import Login from "./components/Login";
import Register from "./components/Register";
import AboutUs from "./AboutUs";
import Movies from "./components/Movies";
import Dashboard from "./components/admin/Dashboard";
import Movie from "./components/admin/Movie";
import RouteNotFound from "./components/RouteNotFound";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path={Paths.Route_Home} element={<App />} />
        <Route path={Paths.Route_Login} element={<Login />} />
        <Route path={Paths.Route_Register} element={<Register />} />
        <Route path={Paths.Route_Aboutus} element={<AboutUs />} />
        <Route path={Paths.Route_Movies} element={<Movies />} />
        <Route path={Paths.Route_Admin}>
          <Route index element={<Dashboard />} />
          <Route path={Paths.Route_Admin_Dashboard} element={<Dashboard />} />
          <Route path={Paths.Route_Admin_Movie} element={<Movie />} />
        </Route>
        <Route path="*" element={<RouteNotFound />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
