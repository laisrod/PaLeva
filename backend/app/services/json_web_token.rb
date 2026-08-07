class JsonWebToken
  ALGORITHM = "HS256".freeze
  EXPIRATION = 24.hours

  class DecodeError < StandardError; end

  def self.encode(exp: EXPIRATION.from_now, **payload)
    payload[:exp] = exp.to_i
    JWT.encode(payload, secret_key, ALGORITHM)
  end

  def self.decode(token)
    decoded = JWT.decode(token, secret_key, true, algorithm: ALGORITHM).first
    ActiveSupport::HashWithIndifferentAccess.new(decoded)
  rescue JWT::DecodeError, JWT::ExpiredSignature
    raise DecodeError
  end

  def self.secret_key
    Rails.application.secret_key_base
  end
end
