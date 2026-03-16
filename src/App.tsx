import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import './App.css'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { selectVehicleById, selectVehicleStats, selectVehicles } from './features/vehicles/selectors'
import { Vehicle, VehicleStatus } from './features/vehicles/types'
import { addVehicle, updateVehicle } from './features/vehicles/vehiclesSlice'
import { useDebounce } from './hooks/useDebounce'

type FormMode = 'add' | 'edit'
type SortOption = 'mileage-desc' | 'status-asc' | 'service-date-desc'

interface VehicleFormValues {
  name: string
  type: string
  status: VehicleStatus
  mileage: string
  lastServiceDate: string
}

type VehicleFormErrors = Partial<Record<keyof VehicleFormValues, string>>

const vehicleTypeOptions = ['Van', 'Truck', 'Bike', 'Car']
const statusOptions: VehicleStatus[] = ['Active', 'Inactive', 'In Maintenance']

const emptyFormValues: VehicleFormValues = {
  name: '',
  type: 'Van',
  status: 'Active',
  mileage: '',
  lastServiceDate: '',
}

const getNextVehicleId = (vehicles: Vehicle[]) => {
  const lastNumericId = vehicles.reduce((maxId, vehicle) => {
    const numericId = Number.parseInt(vehicle.id.replace('VH-', ''), 10)
    if (Number.isNaN(numericId)) {
      return maxId
    }

    return Math.max(maxId, numericId)
  }, 0)

  return `VH-${String(lastNumericId + 1).padStart(3, '0')}`
}

const validateForm = (values: VehicleFormValues): VehicleFormErrors => {
  const errors: VehicleFormErrors = {}

  if (!values.name.trim()) {
    errors.name = 'Vehicle name is required.'
  }

  if (!vehicleTypeOptions.includes(values.type)) {
    errors.type = 'Please choose a valid vehicle type.'
  }

  if (!statusOptions.includes(values.status)) {
    errors.status = 'Please choose a valid status.'
  }

  const mileage = Number(values.mileage)
  if (!values.mileage.trim()) {
    errors.mileage = 'Mileage is required.'
  } else if (!Number.isInteger(mileage) || mileage < 0) {
    errors.mileage = 'Mileage must be a positive whole number.'
  }

  if (!values.lastServiceDate) {
    errors.lastServiceDate = 'Last service date is required.'
  }

  return errors
}

function DashboardPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const vehicles = useAppSelector(selectVehicles)
  const stats = useAppSelector(selectVehicleStats)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('mileage-desc')
  const [formMode, setFormMode] = useState<FormMode>('add')
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<VehicleFormValues>(emptyFormValues)
  const [formErrors, setFormErrors] = useState<VehicleFormErrors>({})
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

  const displayedVehicles = useMemo(() => {
    const sortedVehicles = [...filteredVehicles]

    sortedVehicles.sort((leftVehicle, rightVehicle) => {
      if (sortBy === 'mileage-desc') {
        return rightVehicle.mileage - leftVehicle.mileage
      }

      if (sortBy === 'status-asc') {
        return leftVehicle.status.localeCompare(rightVehicle.status)
      }

      const leftTimestamp = Date.parse(leftVehicle.lastServiceDate)
      const rightTimestamp = Date.parse(rightVehicle.lastServiceDate)
      return rightTimestamp - leftTimestamp
    })

    return sortedVehicles
  }, [filteredVehicles, sortBy])

  const resetForm = () => {
    setFormMode('add')
    setEditingVehicleId(null)
    setFormValues(emptyFormValues)
    setFormErrors({})
  }

  const startEdit = (vehicle: Vehicle) => {
    setFormMode('edit')
    setEditingVehicleId(vehicle.id)
    setFormValues({
      name: vehicle.name,
      type: vehicle.type,
      status: vehicle.status,
      mileage: String(vehicle.mileage),
      lastServiceDate: vehicle.lastServiceDate,
    })
    setFormErrors({})
  }

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormValues((previousValues) => ({
      ...previousValues,
      [name]: value,
    }))

    if (formErrors[name as keyof VehicleFormValues]) {
      setFormErrors((previousErrors) => ({
        ...previousErrors,
        [name]: undefined,
      }))
    }
  }

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors = validateForm(formValues)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    const payload = {
      name: formValues.name.trim(),
      type: formValues.type,
      status: formValues.status,
      mileage: Number(formValues.mileage),
      lastServiceDate: formValues.lastServiceDate,
    }

    if (formMode === 'edit' && editingVehicleId) {
      dispatch(
        updateVehicle({
          id: editingVehicleId,
          ...payload,
        }),
      )
    } else {
      dispatch(
        addVehicle({
          id: getNextVehicleId(vehicles),
          ...payload,
        }),
      )
    }

    resetForm()
  }

  useEffect(() => {
    const editVehicleId = searchParams.get('edit')
    if (!editVehicleId) {
      return
    }

    const targetVehicle = vehicles.find((vehicle) => vehicle.id === editVehicleId)
    if (targetVehicle) {
      startEdit(targetVehicle)
    }

    const updatedParams = new URLSearchParams(searchParams)
    updatedParams.delete('edit')
    setSearchParams(updatedParams, { replace: true })
  }, [searchParams, setSearchParams, vehicles])

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
        <div>
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
        </div>
        <div>
          <label htmlFor="vehicle-sort" className="search-label">
            Sort by
          </label>
          <select
            id="vehicle-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="sort-select"
          >
            <option value="mileage-desc">Mileage (high to low)</option>
            <option value="status-asc">Status (A to Z)</option>
            <option value="service-date-desc">Last service date (recent first)</option>
          </select>
        </div>
      </section>

      <section className="form-card">
        <div className="form-header">
          <h2>{formMode === 'add' ? 'Add Vehicle' : `Edit Vehicle (${editingVehicleId})`}</h2>
          {formMode === 'edit' && (
            <button type="button" className="secondary-btn" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleFormSubmit} noValidate className="vehicle-form">
          <label className="form-field">
            <span>Name</span>
            <input
              name="name"
              value={formValues.name}
              onChange={handleFieldChange}
              placeholder="Vehicle name"
            />
            {formErrors.name && <small className="field-error">{formErrors.name}</small>}
          </label>

          <label className="form-field">
            <span>Type</span>
            <select name="type" value={formValues.type} onChange={handleFieldChange}>
              {vehicleTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {formErrors.type && <small className="field-error">{formErrors.type}</small>}
          </label>

          <label className="form-field">
            <span>Status</span>
            <select name="status" value={formValues.status} onChange={handleFieldChange}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {formErrors.status && <small className="field-error">{formErrors.status}</small>}
          </label>

          <label className="form-field">
            <span>Mileage</span>
            <input
              name="mileage"
              value={formValues.mileage}
              onChange={handleFieldChange}
              placeholder="e.g. 12000"
              inputMode="numeric"
            />
            {formErrors.mileage && <small className="field-error">{formErrors.mileage}</small>}
          </label>

          <label className="form-field">
            <span>Last Service Date</span>
            <input
              name="lastServiceDate"
              type="date"
              value={formValues.lastServiceDate}
              onChange={handleFieldChange}
            />
            {formErrors.lastServiceDate && (
              <small className="field-error">{formErrors.lastServiceDate}</small>
            )}
          </label>

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              {formMode === 'add' ? 'Add Vehicle' : 'Save Changes'}
            </button>
          </div>
        </form>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedVehicles.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-state">
                  No vehicles found for "{debouncedSearchTerm}".
                </td>
              </tr>
            ) : (
              displayedVehicles.map((vehicle) => (
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
                    <button type="button" className="link-btn" onClick={() => startEdit(vehicle)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  )
}

function VehicleDetailPage() {
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/vehicles/:vehicleId" element={<VehicleDetailPage />} />
    </Routes>
  )
}

export default App
