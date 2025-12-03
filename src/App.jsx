import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import { GoogleLogin, OAuthCallback } from './components/GoogleLogin';


function MainApp() {
  const [count, setCount] = useState(0)

  return (
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

      {/* OAuth login button/ 
      redirect to backedn /auth/google then back to FE http://localhost:5173/frontend-admin-service/oauth-callback?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzAzZWYwN2IwM2RmOTNjZjE1MGQyNiIsInVzZXJuYW1lIjoiSGFzc2FuRGV2IiwiZW1haWwiOiJoYXNzYW4xOTk4ZGV2QGdtYWlsLmNvbSIsImlhdCI6MTc2NDc2OTc2MiwiZXhwIjoxNzY0ODU2MTYyfQ.QagtBNnBLl8NN9twO759utTqqRZGiTuHaGt_eBAiKfs */}
      <div style={{ marginTop: 20 }}>
        <GoogleLogin />
      </div>

    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/oauth-callback" element={<OAuthCallback />} />
    </Routes>
  );
}

export default App
