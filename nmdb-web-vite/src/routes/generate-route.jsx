/* eslint-disable react/prop-types */
import flattenDeep from "lodash/flattenDeep";
import { Route, Routes as ReactRoutes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const generateFlattenRoutes = (routes, parentPath = "") => {
  if (!routes) return [];

  return flattenDeep(
    routes.map(({ routes: subRoutes, ...rest }) => [
      rest,
      generateFlattenRoutes(subRoutes),
    ]),
  );
};

export const renderRoutes = (mainRoutes) => {
  const Routes = ({ isAuthorized }) => {
    const layouts = mainRoutes.map(({ layout: Layout, routes }, index) => {
      const subRoutes = generateFlattenRoutes(routes);
      return (
        <Route key={index} element={<Layout />}>
          {subRoutes.map(({ component: Component, path, name, isPublic }) => {
            // If route is not public and user is not authorized, render ProtectedRoute
            if (!isPublic && !isAuthorized) {
              return (
                <Route key={name} element={<ProtectedRoute />} path={path} />
              );
            }
            // If route is public or user is authorized, render the component
            return (
              Component &&
              path && <Route key={name} element={<Component />} path={path} />
            );
          })}
        </Route>
      );
    });
    return <ReactRoutes>{layouts}</ReactRoutes>;
  };
  return Routes;
};
