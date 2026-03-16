import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

export const selectVehiclesState = (state: RootState) => state.vehicles

export const selectVehicles = createSelector(
  [selectVehiclesState],
  (vehiclesState) => vehiclesState.items,
)

export const selectVehicleStats = createSelector([selectVehicles], (vehicles) => {
  return vehicles.reduce(
    (stats, vehicle) => {
      stats.total += 1
      if (vehicle.status === 'Active') stats.active += 1
      if (vehicle.status === 'Inactive') stats.inactive += 1
      if (vehicle.status === 'In Maintenance') stats.inMaintenance += 1
      return stats
    },
    {
      total: 0,
      active: 0,
      inactive: 0,
      inMaintenance: 0,
    },
  )
})

export const selectVehicleById = (vehicleId: string) =>
  createSelector([selectVehicles], (vehicles) =>
    vehicles.find((vehicle) => vehicle.id === vehicleId),
  )
