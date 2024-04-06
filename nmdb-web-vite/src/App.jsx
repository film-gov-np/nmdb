import { Routes } from "./routes";
import "./index.css"
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
const App = () => {
  return (
    <ThemeProvider>
      <Routes isAuthorized={true} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;