import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Vehicle, VehiclesState } from './types'

const initialState: VehiclesState = {
  items: [
    {
      id: 'VH-001',
      name: 'City Runner',
      type: 'Van',
      status: 'Active',
      mileage: 12450,
      lastServiceDate: '2026-01-15',
    },
    {
      id: 'VH-002',
      name: 'Cold Chain One',
      type: 'Truck',
      status: 'In Maintenance',
      mileage: 48320,
      lastServiceDate: '2025-12-21',
    },
    {
      id: 'VH-003',
      name: 'Express Bike 1',
      type: 'Bike',
      status: 'Active',
      mileage: 8120,
      lastServiceDate: '2026-02-10',
    },
    {
      id: 'VH-004',
      name: 'Express Bike 2',
      type: 'Bike',
      status: 'Inactive',
      mileage: 7310,
      lastServiceDate: '2025-10-03',
    },
    {
      id: 'VH-005',
      name: 'Highway Carrier',
      type: 'Truck',
      status: 'Active',
      mileage: 90555,
      lastServiceDate: '2026-01-02',
    },
    {
      id: 'VH-006',
      name: 'Suburb Shuttle',
      type: 'Van',
      status: 'Active',
      mileage: 22300,
      lastServiceDate: '2025-11-18',
    },
    {
      id: 'VH-007',
      name: 'Night Rider',
      type: 'Car',
      status: 'In Maintenance',
      mileage: 36740,
      lastServiceDate: '2026-02-25',
    },
    {
      id: 'VH-008',
      name: 'Bulk Mover',
      type: 'Truck',
      status: 'Inactive',
      mileage: 110230,
      lastServiceDate: '2025-09-09',
    },
    {
      id: 'VH-009',
      name: 'Downtown Mini',
      type: 'Car',
      status: 'Active',
      mileage: 15420,
      lastServiceDate: '2026-02-01',
    },
    {
      id: 'VH-010',
      name: 'Fresh Route',
      type: 'Van',
      status: 'Active',
      mileage: 27900,
      lastServiceDate: '2025-12-30',
    },
  ],
}

const isSameVehicleData = (source: Vehicle, target: Vehicle) =>
  source.name === target.name &&
  source.type === target.type &&
  source.status === target.status &&
  source.mileage === target.mileage &&
  source.lastServiceDate === target.lastServiceDate

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    addVehicle: (state, action: PayloadAction<Vehicle>) => {
      const existing = state.items.find((vehicle) => vehicle.id === action.payload.id)

      // Idempotent add: same payload for same ID is ignored.
      if (existing && isSameVehicleData(existing, action.payload)) {
        return
      }

      if (existing) {
        Object.assign(existing, action.payload)
        return
      }

      state.items.push(action.payload)
    },
    updateVehicle: (state, action: PayloadAction<Vehicle>) => {
      const index = state.items.findIndex((vehicle) => vehicle.id === action.payload.id)
      if (index === -1) {
        return
      }

      if (isSameVehicleData(state.items[index], action.payload)) {
        return
      }

      state.items[index] = action.payload
    },
  },
})

export const { addVehicle, updateVehicle } = vehiclesSlice.actions
export const vehiclesReducer = vehiclesSlice.reducer
