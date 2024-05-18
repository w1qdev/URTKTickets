import { Routes, Route } from "react-router-dom";
import TicketsPage from "./pages/TicketsPage.jsx";
import "./App.css";

function App() {
    return (
        <Routes>
            <Route path="/" element={<TicketsPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
        </Routes>
    );
}

export default App;
