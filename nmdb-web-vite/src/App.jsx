import { Routes } from "./routes";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { AuthContext } from "./components/admin/context/AuthContext";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axiosInstance from "./helpers/axiosSetup";
import { ApiPaths } from "./constants/apiPaths";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
  },
});

const App = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(ApiPaths.Path_Session)
      .then((resp) => {
        if (resp && resp.data && resp.data.isSuccess) {
          const { data } = resp.data;
          setIsAuthorized(true);
          setUserInfo(data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {!isLoading && (
        <ThemeProvider>
          <AuthContext.Provider
            value={{ isAuthorized, userInfo, setUserInfo, setIsAuthorized }}
          >
            <QueryClientProvider client={queryClient}>
              <Routes isAuthorized={isAuthorized} />
            </QueryClientProvider>
          </AuthContext.Provider>
          <Toaster />
        </ThemeProvider>
      )}
    </>
  );
};

export default App;
