require 'net/http'
require 'json'
require 'jwt'

class FirebaseTokenValidator
  FIREBASE_CERT_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
  
  class << self
    def validate(token)
      return nil if token.blank?
      
      Rails.logger.info "Validando token Firebase (primeiros 20 chars): #{token[0..20]}..."
      
      begin
        decoded_token = JWT.decode(token, nil, false)
        header = decoded_token[1]
        
        kid = header['kid']
        unless kid
          Rails.logger.error "Token não tem 'kid' no header"
          return nil
        end
        
        Rails.logger.info "Buscando chave pública com kid: #{kid}"
        public_key = fetch_public_key(kid)
        unless public_key
          Rails.logger.error "Não foi possível obter chave pública para kid: #{kid}"
          return nil
        end
        
        decoded = JWT.decode(token, public_key, true, {
          algorithm: 'RS256',
          verify_iat: true,
          verify_expiration: true
        })
        
        payload = decoded[0]
        Rails.logger.info "Token decodificado. Email: #{payload['email']}, UID: #{payload['user_id'] || payload['sub']}"
        
        project_id = ENV['FIREBASE_PROJECT_ID'] || Rails.application.credentials.dig(:firebase, :project_id) || 'palevar'
        Rails.logger.info "Project ID configurado: #{project_id}"
        
        if payload['aud'] != project_id
          Rails.logger.warn "Token audience mismatch: expected #{project_id}, got #{payload['aud']}"
          return nil
        end
        
        expected_issuer = "https://securetoken.google.com/#{project_id}"
        if payload['iss'] != expected_issuer
          Rails.logger.warn "Token issuer mismatch: expected #{expected_issuer}, got #{payload['iss']}"
          return nil
        end
        
        {
          uid: payload['user_id'] || payload['sub'],
          email: payload['email'],
          email_verified: payload['email_verified'] || false,
          name: payload['name'],
          firebase_claims: payload
        }
      rescue JWT::ExpiredSignature => e
        Rails.logger.error "Firebase token expired: #{e.message}"
        nil
      rescue JWT::DecodeError => e
        Rails.logger.error "Firebase token decode error: #{e.message}"
        Rails.logger.error "Token preview: #{token[0..50]}..." if token
        Rails.logger.error "Backtrace: #{e.backtrace.first(3).join("\n")}"
        nil
      rescue StandardError => e
        Rails.logger.error "Firebase token validation error: #{e.class}: #{e.message}"
        Rails.logger.error "Backtrace: #{e.backtrace.first(10).join("\n")}"
        nil
      end
    end
    
    private
    
    def fetch_public_key(kid)
      @public_keys_cache ||= {}
      @cache_timestamp ||= {}
      
      if @public_keys_cache[kid] && @cache_timestamp[kid] && Time.now - @cache_timestamp[kid] < 3600
        Rails.logger.info "Usando chave pública em cache para kid: #{kid}"
        return @public_keys_cache[kid]
      end
      
      Rails.logger.info "Buscando chave pública do Firebase para kid: #{kid}"
      uri = URI(FIREBASE_CERT_URL)
      
      begin
        response = Net::HTTP.get_response(uri)
        
        unless response.is_a?(Net::HTTPSuccess)
          Rails.logger.error "Erro ao buscar chaves públicas: #{response.code} #{response.message}"
          return nil
        end
        
        keys = JSON.parse(response.body)
        public_key_pem = keys[kid]
        
        unless public_key_pem
          Rails.logger.error "Kid #{kid} não encontrado nas chaves públicas. Kids disponíveis: #{keys.keys.join(', ')}"
          return nil
        end
        
        Rails.logger.info "Chave pública PEM obtida (primeiros 50 chars): #{public_key_pem[0..50]}..."
        
        begin
          # Firebase retorna certificado X.509, precisamos extrair a chave pública
          # A chave vem como certificado X.509, não como chave RSA direta
          cert = OpenSSL::X509::Certificate.new(public_key_pem)
          public_key = cert.public_key
          
          unless public_key.is_a?(OpenSSL::PKey::RSA)
            Rails.logger.error "Chave pública não é RSA: #{public_key.class}"
            return nil
          end
          
          Rails.logger.info "Chave pública extraída do certificado X.509 com sucesso"
        rescue OpenSSL::X509::CertificateError => e
          Rails.logger.error "Erro ao processar certificado X.509: #{e.message}"
          Rails.logger.error "Tentando processar como chave RSA direta..."
          # Tentar como chave RSA direta se falhar como certificado
          begin
            public_key = OpenSSL::PKey::RSA.new(public_key_pem)
            Rails.logger.info "Chave processada como RSA direta com sucesso"
          rescue => e2
            Rails.logger.error "Também falhou como chave RSA: #{e2.class}: #{e2.message}"
            Rails.logger.error "Formato da chave pode estar incorreto"
            return nil
          end
        rescue => e
          Rails.logger.error "Erro inesperado ao processar chave: #{e.class}: #{e.message}"
          Rails.logger.error "Backtrace: #{e.backtrace.first(5).join("\n")}"
          return nil
        end
        
        @public_keys_cache[kid] = public_key
        @cache_timestamp[kid] = Time.now
        
        Rails.logger.info "Chave pública obtida com sucesso para kid: #{kid}"
        public_key
      rescue StandardError => e
        Rails.logger.error "Erro ao buscar chave pública: #{e.class}: #{e.message}"
        Rails.logger.error "Backtrace: #{e.backtrace.first(5).join("\n")}"
        nil
      end
    end
  end
end
