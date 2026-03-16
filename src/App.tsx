import './App.css'
import { useAppSelector } from './app/hooks'
import { selectVehicleStats, selectVehicles } from './features/vehicles/selectors'

function App() {
  const vehicles = useAppSelector(selectVehicles)
  const stats = useAppSelector(selectVehicleStats)

  return (
    <main className="app-shell">
      <header className="page-header">
        <h1>EA Foods Fleet Dashboard</h1>
        <div className="stats-inline">
          <span>Total: {stats.total}</span>
          <span>Active: {stats.active}</span>
          <span>In Maintenance: {stats.inMaintenance}</span>
          <span>Inactive: {stats.inactive}</span>
        </div>
      </header>

      <section className="table-card">
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Mileage</th>
              <th>Last Service Date</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.id}</td>
                <td>{vehicle.name}</td>
                <td>{vehicle.type}</td>
                <td>
                  <span className={`status-badge status-${vehicle.status.toLowerCase().replace(/ /g, '-')}`}>
                    {vehicle.status}
                  </span>
                </td>
                <td>{vehicle.mileage.toLocaleString()}</td>
                <td>{vehicle.lastServiceDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}

export default App
