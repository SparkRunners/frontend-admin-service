import { Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ScootersPage from "./pages/ScootersPage";
import "./App.css";

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/scooters" element={<ScootersPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Login />} />
        </Routes>
    );
}
