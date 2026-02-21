# Configuração do OAuth
# Nota: OAuth implementado manualmente sem usar o middleware OmniAuth
# As gems omniauth e omniauth-google-oauth2 foram removidas
# Toda a lógica OAuth está no OmniauthCallbacksController
#
# O OAuth é implementado manualmente usando Net::HTTP para:
# 1. Redirecionar para Google OAuth (action initiate)
# 2. Trocar código por token (método exchange_code_for_token)
# 3. Buscar dados do usuário (método fetch_user_info)
# 4. Criar/atualizar usuário (método find_or_create_user_from_google_data)
