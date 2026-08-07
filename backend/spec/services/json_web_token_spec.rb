require 'rails_helper'

RSpec.describe JsonWebToken do
  describe '.encode / .decode' do
    it 'round-trips a payload' do
      token = described_class.encode(user_id: 42)

      decoded = described_class.decode(token)

      expect(decoded[:user_id]).to eq(42)
    end

    it 'sets an expiration claim in the future by default' do
      token = described_class.encode(user_id: 1)

      decoded = described_class.decode(token)

      expect(decoded[:exp]).to be_within(5).of(JsonWebToken::EXPIRATION.from_now.to_i)
    end

    it 'raises DecodeError for an expired token' do
      token = described_class.encode(user_id: 1, exp: 1.hour.ago)

      expect { described_class.decode(token) }.to raise_error(JsonWebToken::DecodeError)
    end

    it 'raises DecodeError for a tampered payload' do
      token = described_class.encode(user_id: 1)
      header, payload, signature = token.split(".")
      forged_payload = Base64.urlsafe_encode64({ user_id: 999 }.to_json, padding: false)

      tampered = [ header, forged_payload, signature ].join(".")

      expect { described_class.decode(tampered) }.to raise_error(JsonWebToken::DecodeError)
    end

    it 'raises DecodeError for garbage input' do
      expect { described_class.decode('not-a-token') }.to raise_error(JsonWebToken::DecodeError)
    end
  end
end
