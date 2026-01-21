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
  console.error('Firebase não configurado! Configure as variáveis de ambiente VITE_FIREBASE_* no arquivo .env')
  console.error('Variáveis necessárias:', {
    VITE_FIREBASE_API_KEY: !!firebaseConfig.apiKey,
    VITE_FIREBASE_AUTH_DOMAIN: !!firebaseConfig.authDomain,
    VITE_FIREBASE_PROJECT_ID: !!firebaseConfig.projectId,
    VITE_FIREBASE_STORAGE_BUCKET: !!firebaseConfig.storageBucket,
    VITE_FIREBASE_MESSAGING_SENDER_ID: !!firebaseConfig.messagingSenderId,
    VITE_FIREBASE_APP_ID: !!firebaseConfig.appId,
  })
}

let app: any = null
let auth: any = null

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    console.log('Firebase inicializado com sucesso')
    console.log('Configuração:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'não configurado'
    })
  } else {
    console.warn('Firebase não configurado - variáveis de ambiente ausentes')
  }
} catch (error) {
  console.error('Erro ao inicializar Firebase:', error)
  // Não lançar erro para não quebrar a aplicação
  // A aplicação pode funcionar sem Firebase em modo de desenvolvimento
}

export { auth }
export default app
