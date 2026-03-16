import { Route, Routes } from 'react-router-dom'
import './App.css'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { VehicleDetailPage } from './features/vehicles/pages/VehicleDetailPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/vehicles/:vehicleId" element={<VehicleDetailPage />} />
    </Routes>
  )
}

export default App
