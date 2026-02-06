import { Establishment } from '../../establishments/types/establishment'

export interface DashboardContentProps {
  establishment: Establishment
  isOwner: boolean
}

export interface DashboardErrorProps {
  message: string
}
