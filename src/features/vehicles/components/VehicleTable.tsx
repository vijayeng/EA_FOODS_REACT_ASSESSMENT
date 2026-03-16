import { Link, useNavigate } from 'react-router-dom'
import { Vehicle } from '../types'

interface VehicleTableProps {
  vehicles: Vehicle[]
  searchTerm: string
  onEdit: (vehicle: Vehicle) => void
}

export function VehicleTable({ vehicles, searchTerm, onEdit }: VehicleTableProps) {
  const navigate = useNavigate()

  return (
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length === 0 ? (
            <tr>
              <td colSpan={7} className="empty-state">
                No vehicles found for "{searchTerm}".
              </td>
            </tr>
          ) : (
            vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.id}</td>
                <td>
                  <Link className="table-link" to={`/vehicles/${vehicle.id}`}>
                    {vehicle.name}
                  </Link>
                </td>
                <td>{vehicle.type}</td>
                <td>
                  <span className={`status-badge status-${vehicle.status.toLowerCase().replace(/ /g, '-')}`}>
                    {vehicle.status}
                  </span>
                </td>
                <td>{vehicle.mileage.toLocaleString()}</td>
                <td>{vehicle.lastServiceDate}</td>
                <td className="action-cell">
                  <button
                    type="button"
                    className="link-btn secondary-link-btn"
                    onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                  >
                    View
                  </button>
                  <button type="button" className="link-btn" onClick={() => onEdit(vehicle)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  )
}
