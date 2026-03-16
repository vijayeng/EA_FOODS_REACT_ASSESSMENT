import { ChangeEvent, FormEvent } from 'react'
import {
  FormMode,
  statusOptions,
  vehicleTypeOptions,
  VehicleFormErrors,
  VehicleFormValues,
} from '../formConfig'

interface VehicleFormCardProps {
  formMode: FormMode
  editingVehicleId: string | null
  formValues: VehicleFormValues
  formErrors: VehicleFormErrors
  onCancelEdit: () => void
  onFieldChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function VehicleFormCard({
  formMode,
  editingVehicleId,
  formValues,
  formErrors,
  onCancelEdit,
  onFieldChange,
  onSubmit,
}: VehicleFormCardProps) {
  return (
    <section className="form-card">
      <div className="form-header">
        <h2>{formMode === 'add' ? 'Add Vehicle' : `Edit Vehicle (${editingVehicleId})`}</h2>
        {formMode === 'edit' && (
          <button type="button" className="secondary-btn" onClick={onCancelEdit}>
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} noValidate className="vehicle-form">
        <label className="form-field">
          <span>Name</span>
          <input
            name="name"
            value={formValues.name}
            onChange={onFieldChange}
            placeholder="Vehicle name"
          />
          {formErrors.name && <small className="field-error">{formErrors.name}</small>}
        </label>

        <label className="form-field">
          <span>Type</span>
          <select name="type" value={formValues.type} onChange={onFieldChange}>
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
          <select name="status" value={formValues.status} onChange={onFieldChange}>
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
            onChange={onFieldChange}
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
            onChange={onFieldChange}
          />
          {formErrors.lastServiceDate && <small className="field-error">{formErrors.lastServiceDate}</small>}
        </label>

        <div className="form-actions">
          <button type="submit" className="primary-btn">
            {formMode === 'add' ? 'Add Vehicle' : 'Save Changes'}
          </button>
        </div>
      </form>
    </section>
  )
}
