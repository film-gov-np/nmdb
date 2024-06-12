import { Routes } from "./routes";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { AuthContext } from "./components/admin/context/AuthContext";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axiosInstance from "./helpers/axiosSetup";
import { ApiPaths } from "./constants/apiPaths";

const queryClient = new QueryClient()

const App = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    axiosInstance.get(ApiPaths.Path_Session).then((resp) => {
      if (resp && resp.data) {
        const { isActive } = resp.data;
        if (isActive) {
          setIsAuthorized(true);
        }
      }
      setIsLoading(false);

    }).catch(() => {
      setIsLoading(false);
    });
  }, []);

  return (<>
    {!isLoading &&
      <ThemeProvider>
        <AuthContext.Provider value={{ isAuthorized, setIsAuthorized }}>
          <QueryClientProvider client={queryClient}>
            <Routes isAuthorized={isAuthorized} />
          </QueryClientProvider>
        </AuthContext.Provider>
        <Toaster />
      </ThemeProvider>
    }
  </>
  );
};

export default App;
