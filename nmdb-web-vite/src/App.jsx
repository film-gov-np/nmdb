import { Routes } from "./routes";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { AuthContext } from "./components/admin/context/AuthContext";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()

const App = () => {
  const [isAuthorized, setIsAuthorized] = useState(true);
  return (
    <ThemeProvider>
      <AuthContext.Provider value={{ isAuthorized, setIsAuthorized }}>
      <QueryClientProvider client={queryClient}>
        <Routes isAuthorized={isAuthorized} />
        </QueryClientProvider>
      </AuthContext.Provider>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
