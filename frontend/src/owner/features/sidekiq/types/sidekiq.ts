export interface SidekiqQueue {
  name: string
  size: number
  latency: number
}

export interface SidekiqStats {
  processed: number
  failed: number
  enqueued: number
  scheduled: number
  retries: number
  dead: number
  queues: SidekiqQueue[]
}
