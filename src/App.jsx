import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

import Dashboard from "./pages/Dashboard";
import ScootersPage from "./pages/ScootersPage";

import StationsPage from "./features/stations/StationsPage";
import ParkingZonesPage from "./features/parking/ParkingZonesPage";
import RidesPage from "./features/rides/RidesPage";
import PaymentsPage from "./features/payments/PaymentsPage";
import AdminMapPage from "./features/map/AdminMapPage";

import CustomersPage from "./features/customers/CustomersPage";
import CustomerDetailPage from "./features/customers/CustomerDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scooters" element={<ScootersPage />} />

          <Route path="/stations" element={<StationsPage />} />
          <Route path="/parking-zones" element={<ParkingZonesPage />} />
          <Route path="/rides" element={<RidesPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/map" element={<AdminMapPage />} />

          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/:userId" element={<CustomerDetailPage />} />

          <Route path="/admin/customers" element={<Navigate to="/customers" replace />} />
          <Route path="/admin/customers/:userId" element={<CustomerDetailPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
}
