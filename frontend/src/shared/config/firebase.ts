import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Verificar se as variáveis de ambiente estão configuradas
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Firebase não configurado! Configure as variáveis de ambiente VITE_FIREBASE_* no arquivo .env')
  console.error('Variáveis necessárias:', {
    VITE_FIREBASE_API_KEY: !!firebaseConfig.apiKey,
    VITE_FIREBASE_AUTH_DOMAIN: !!firebaseConfig.authDomain,
    VITE_FIREBASE_PROJECT_ID: !!firebaseConfig.projectId,
    VITE_FIREBASE_STORAGE_BUCKET: !!firebaseConfig.storageBucket,
    VITE_FIREBASE_MESSAGING_SENDER_ID: !!firebaseConfig.messagingSenderId,
    VITE_FIREBASE_APP_ID: !!firebaseConfig.appId,
  })
}

let app
let auth

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  console.log('✅ Firebase inicializado com sucesso')
  console.log('Configuração:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'não configurado'
  })
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase:', error)
  throw error
}

export { auth }
export default app
