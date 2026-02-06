export interface WorkingHour {
  id: number
  week_day: string
  opening_hour: string | null
  closing_hour: string | null
  open: boolean
}

export interface WorkingHourUpdate {
  opening_hour?: string
  closing_hour?: string
  open: boolean
}

export interface UseWorkingHoursOptions {
  code: string | undefined
  onSuccess?: () => void
}
