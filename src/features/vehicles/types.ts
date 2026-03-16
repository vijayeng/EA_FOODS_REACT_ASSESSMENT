export type VehicleStatus = 'Active' | 'Inactive' | 'In Maintenance'

export interface Vehicle {
  id: string
  name: string
  type: string
  status: VehicleStatus
  mileage: number
  lastServiceDate: string
}

export interface VehiclesState {
  items: Vehicle[]
}
