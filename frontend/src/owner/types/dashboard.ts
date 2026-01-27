import { Establishment } from './establishment'

export interface DashboardContentProps {
  establishment: Establishment
  isOwner: boolean
}

export interface DashboardErrorProps {
  message: string
}
