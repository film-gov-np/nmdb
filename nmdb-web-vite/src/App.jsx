import { Routes } from "./routes";
import "./index.css"
import { ThemeProvider } from "./components/theme-provider";
const App = () => {
  return (
    <ThemeProvider>
      <Routes isAuthorized={true} />
    </ThemeProvider>
  );
}

export default App;