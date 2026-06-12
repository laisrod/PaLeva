import { BaseApiService } from '../../../shared/services/api/base'
import { SidekiqStats } from '../types/sidekiq'

export class SidekiqApi extends BaseApiService {
  getStats() {
    return this.request<SidekiqStats>('/sidekiq/stats')
  }
}
