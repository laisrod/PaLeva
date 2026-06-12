require 'sidekiq/api'

module Api
  module V1
    class SidekiqStatsController < ApplicationController
      include AuthenticableApi

      before_action :authenticate_api_user!
      skip_before_action :verify_authenticity_token
      skip_before_action :create_current_order
      skip_before_action :set_active_storage_url_options

      def index
        stats = Sidekiq::Stats.new

        queues = Sidekiq::Queue.all.map do |queue|
          { name: queue.name, size: queue.size, latency: queue.latency.round(2) }
        end

        render json: {
          processed: stats.processed,
          failed:    stats.failed,
          enqueued:  stats.enqueued,
          scheduled: stats.scheduled_size,
          retries:   stats.retry_size,
          dead:      stats.dead_size,
          queues:    queues
        }
      rescue => e
        render json: { error: "Erro ao buscar stats do Sidekiq: #{e.message}" }, status: :internal_server_error
      end
    end
  end
end
