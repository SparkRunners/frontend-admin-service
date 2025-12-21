import { Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import ScootersPage from "./pages/ScootersPage";
import "./App.css";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="scooters" element={<ScootersPage />} />
                <Route path="coming-soon" element={<p>Kommer senare...</p>} />
            </Route>
        </Routes>
    );
}
