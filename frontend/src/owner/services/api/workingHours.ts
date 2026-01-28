import { BaseApiService } from './base'
import { WorkingHour, WorkingHourUpdate } from '../../types/workingHours'

export class WorkingHoursApi extends BaseApiService {
  async getWorkingHours(establishmentCode: string) {
    return this.request<WorkingHour[]>(`/establishments/${establishmentCode}/working_hours`)
  }

  async updateWorkingHour(
    establishmentCode: string,
    workingHourId: number,
    workingHourData: WorkingHourUpdate
  ) {
    return this.request<{
      working_hour: WorkingHour
      message: string
    }>(`/establishments/${establishmentCode}/working_hours/${workingHourId}`, {
      method: 'PATCH',
      body: JSON.stringify({ working_hour: workingHourData }),
    })
  }
}
