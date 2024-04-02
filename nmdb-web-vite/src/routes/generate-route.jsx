/* eslint-disable react/prop-types */
import flattenDeep from "lodash/flattenDeep";
import { Route, Routes as ReactRoutes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const generateFlattenRoutes = (routes, parentPath = "") => {
  if (!routes) return [];

  return flattenDeep(
    routes.map(({ routes: subRoutes, path: currentPath, ...rest }) => {
      const fullPath = parentPath + currentPath; // to concat with parent routes
      return [
        { ...rest, path: fullPath },
        generateFlattenRoutes(subRoutes, fullPath),
      ];
    })
  );
};

export const renderRoutes = (mainRoutes) => {
  const Routes = ({ isAuthorized}) => {
    const layouts = mainRoutes.map(({ layout: Layout, routes }, index) => {
      const subRoutes = generateFlattenRoutes(routes);
      return (
        <Route key={index} element={<Layout />}>
          <Route
            element={
              <ProtectedRoute isAuthorized={isAuthorized} />
            }
          >
            {subRoutes.map(({ component: Component, path, name }) => {
              return (
                Component &&
                path && <Route key={name} element={<Component />} path={path} />
              );
            })}
          </Route>
        </Route>
      );
    });
    return <ReactRoutes>{layouts}</ReactRoutes>;
  };
  return Routes;
};
