export type TimeOfDay = 'morning' | 'afternoon' | 'evening'

export interface ProfileSnapshot {
  id: string
  name: string
  height: number
  weight: number
  age?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface WorkoutSet {
  id: string
  setNumber: number
  weight: number
  notes?: string
}

export interface ExerciseGroup {
  id: string
  exerciseName: string
  sets: WorkoutSet[]
}

export interface WorkoutRecord {
  id: string
  date: string
  timeOfDay: TimeOfDay
  groups: ExerciseGroup[]
  createdAt: string
  updatedAt: string
}

export interface ProfileFormData {
  name: string
  height: number | null
  weight: number | null
  age?: number | null
  notes?: string
}

export interface WorkoutFormData {
  date: string
  timeOfDay: TimeOfDay | ''
  groups: ExerciseGroup[]
}
