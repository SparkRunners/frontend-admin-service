import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
<<<<<<< Updated upstream
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <h1>This text was added ++in the mounted file to test---</h1>
    </>
  )
=======
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
  
>>>>>>> Stashed changes
}

export default App
