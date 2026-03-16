import './App.css'
import { useAppSelector } from './app/hooks'
import { selectVehicleStats } from './features/vehicles/selectors'

function App() {
  const stats = useAppSelector(selectVehicleStats)

  return (
    <main className="app-shell">
      <h1>EA Foods Fleet Dashboard</h1>
      <p>Redux store initialized with seeded vehicle data.</p>
      <p>
        Total: {stats.total} | Active: {stats.active} | In Maintenance: {stats.inMaintenance} |
        Inactive: {stats.inactive}
      </p>
    </main>
  )
}

export default App
