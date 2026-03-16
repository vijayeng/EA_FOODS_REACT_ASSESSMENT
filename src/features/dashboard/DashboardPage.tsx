import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectVehicleStats, selectVehicles } from '../vehicles/selectors'
import { Vehicle } from '../vehicles/types'
import { addVehicle, updateVehicle } from '../vehicles/vehiclesSlice'
import { useDebounce } from '../../hooks/useDebounce'
import {
  emptyFormValues,
  filterVehicles,
  FormMode,
  getNextVehicleId,
  sortVehicles,
  SortOption,
  validateForm,
  VehicleFormErrors,
  VehicleFormValues,
} from '../vehicles/formConfig'
import { VehicleFormCard } from '../vehicles/components/VehicleFormCard'
import { VehicleTable } from '../vehicles/components/VehicleTable'

export function DashboardPage() {
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

  const filteredVehicles = useMemo(
    () => filterVehicles(vehicles, debouncedSearchTerm),
    [vehicles, debouncedSearchTerm],
  )

  const displayedVehicles = useMemo(
    () => sortVehicles(filteredVehicles, sortBy),
    [filteredVehicles, sortBy],
  )

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

      <VehicleFormCard
        formMode={formMode}
        editingVehicleId={editingVehicleId}
        formValues={formValues}
        formErrors={formErrors}
        onCancelEdit={resetForm}
        onFieldChange={handleFieldChange}
        onSubmit={handleFormSubmit}
      />

      <VehicleTable
        vehicles={displayedVehicles}
        searchTerm={debouncedSearchTerm}
        onEdit={startEdit}
      />
    </main>
  )
}
