import { Routes } from "./routes";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { AuthContext } from "./components/admin/context/AuthContext";
import { useState } from "react";
const App = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  return (
    <ThemeProvider>
      <AuthContext.Provider value={{ isAuthorized, setIsAuthorized }}>
        <Routes isAuthorized={isAuthorized} />
      </AuthContext.Provider>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
