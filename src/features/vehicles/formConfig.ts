import { Vehicle, VehicleStatus } from './types'

export type FormMode = 'add' | 'edit'
export type SortOption = 'mileage-desc' | 'status-asc' | 'service-date-desc'

export interface VehicleFormValues {
  name: string
  type: string
  status: VehicleStatus
  mileage: string
  lastServiceDate: string
}

export type VehicleFormErrors = Partial<Record<keyof VehicleFormValues, string>>

export const vehicleTypeOptions = ['Van', 'Truck', 'Bike', 'Car']
export const statusOptions: VehicleStatus[] = ['Active', 'Inactive', 'In Maintenance']

export const emptyFormValues: VehicleFormValues = {
  name: '',
  type: 'Van',
  status: 'Active',
  mileage: '',
  lastServiceDate: '',
}

export const getNextVehicleId = (vehicles: Vehicle[]) => {
  const lastNumericId = vehicles.reduce((maxId, vehicle) => {
    const numericId = Number.parseInt(vehicle.id.replace('VH-', ''), 10)
    if (Number.isNaN(numericId)) {
      return maxId
    }

    return Math.max(maxId, numericId)
  }, 0)

  return `VH-${String(lastNumericId + 1).padStart(3, '0')}`
}

export const validateForm = (values: VehicleFormValues): VehicleFormErrors => {
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

export const filterVehicles = (vehicles: Vehicle[], searchTerm: string) => {
  const normalizedTerm = searchTerm.trim().toLowerCase()
  if (!normalizedTerm) {
    return vehicles
  }

  return vehicles.filter((vehicle) => {
    const name = vehicle.name.toLowerCase()
    const status = vehicle.status.toLowerCase()
    return name.includes(normalizedTerm) || status.includes(normalizedTerm)
  })
}

export const sortVehicles = (vehicles: Vehicle[], sortBy: SortOption) => {
  const sortedVehicles = [...vehicles]

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
}
