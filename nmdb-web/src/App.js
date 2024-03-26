import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img
          src={"/nmdb-logo.png"}
          height={400}
          width={800}
          className="App-logo"
          alt="logo"
        />
        <p>Film Department Board of Nepal</p>
        <a className="App-link" target="_blank" rel="noopener noreferrer">
          Nepali Movie Database
        </a>
      </header>
    </div>
  );
}

export default App;
