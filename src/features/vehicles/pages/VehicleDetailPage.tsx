import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '../../../app/hooks'
import { selectVehicleById } from '../selectors'

export function VehicleDetailPage() {
  const navigate = useNavigate()
  const { vehicleId } = useParams<{ vehicleId: string }>()
  const selector = useMemo(() => {
    if (!vehicleId) {
      return null
    }

    return selectVehicleById(vehicleId)
  }, [vehicleId])
  const vehicle = useAppSelector((state) => (selector ? selector(state) : undefined))

  if (!vehicle) {
    return (
      <main className="app-shell">
        <section className="detail-card">
          <h1>Vehicle not found</h1>
          <p>The requested vehicle does not exist.</p>
          <button type="button" className="primary-btn" onClick={() => navigate('/')}>
            Back to dashboard
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <section className="detail-card">
        <div className="detail-header">
          <h1>{vehicle.name}</h1>
          <span className={`status-badge status-${vehicle.status.toLowerCase().replace(/ /g, '-')}`}>
            {vehicle.status}
          </span>
        </div>

        <div className="detail-grid">
          <div>
            <h3>ID</h3>
            <p>{vehicle.id}</p>
          </div>
          <div>
            <h3>Type</h3>
            <p>{vehicle.type}</p>
          </div>
          <div>
            <h3>Mileage</h3>
            <p>{vehicle.mileage.toLocaleString()}</p>
          </div>
          <div>
            <h3>Last Service Date</h3>
            <p>{vehicle.lastServiceDate}</p>
          </div>
        </div>

        <div className="detail-actions">
          <button type="button" className="secondary-btn" onClick={() => navigate('/')}>
            Back
          </button>
          <button
            type="button"
            className="primary-btn"
            onClick={() => navigate(`/?edit=${vehicle.id}`)}
          >
            Edit Vehicle
          </button>
        </div>
      </section>
    </main>
  )
}
