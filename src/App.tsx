import { useMemo, useState } from 'react'
import './App.css'
import { useAppSelector } from './app/hooks'
import { selectVehicleStats, selectVehicles } from './features/vehicles/selectors'
import { useDebounce } from './hooks/useDebounce'

function App() {
  const vehicles = useAppSelector(selectVehicles)
  const stats = useAppSelector(selectVehicleStats)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 400)

  const filteredVehicles = useMemo(() => {
    const normalizedTerm = debouncedSearchTerm.trim().toLowerCase()
    if (!normalizedTerm) {
      return vehicles
    }

    return vehicles.filter((vehicle) => {
      const name = vehicle.name.toLowerCase()
      const status = vehicle.status.toLowerCase()
      return name.includes(normalizedTerm) || status.includes(normalizedTerm)
    })
  }, [vehicles, debouncedSearchTerm])

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

      <section className="filters-row">
        <label htmlFor="vehicle-search" className="search-label">
          Search by name or status
        </label>
        <input
          id="vehicle-search"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Try: active, maintenance, city..."
          className="search-input"
        />
      </section>

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
            {filteredVehicles.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  No vehicles found for "{debouncedSearchTerm}".
                </td>
              </tr>
            ) : (
              filteredVehicles.map((vehicle) => (
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
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  )
}

export default App
