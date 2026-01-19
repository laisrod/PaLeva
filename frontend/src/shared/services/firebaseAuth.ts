import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../config/firebase'

export interface FirebaseAuthResult {
  success: boolean
  error?: string
  user?: FirebaseUser
}

export class FirebaseAuthService {
  async signIn(email: string, password: string): Promise<FirebaseAuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return {
        success: true,
        user: userCredential.user,
      }
    } catch (error: any) {
      let errorMessage = 'Erro ao fazer login'
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado'
          break
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta'
          break
        case 'auth/invalid-email':
          errorMessage = 'Email inválido'
          break
        case 'auth/user-disabled':
          errorMessage = 'Usuário desabilitado'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde'
          break
        default:
          errorMessage = error.message || 'Erro ao fazer login'
      }
      
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  async signUp(
    email: string,
    password: string,
    displayName?: string
  ): Promise<FirebaseAuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName,
        })
      }
      
      return {
        success: true,
        user: userCredential.user,
      }
    } catch (error: any) {
      let errorMessage = 'Erro ao criar conta'
      
      console.error('Erro ao criar conta no Firebase:', error)
      console.error('Código do erro:', error.code)
      console.error('Mensagem do erro:', error.message)
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está em uso'
          break
        case 'auth/invalid-email':
          errorMessage = 'Email inválido'
          break
        case 'auth/weak-password':
          errorMessage = 'Senha muito fraca'
          break
        case 'auth/api-key-not-valid':
          errorMessage = 'API key do Firebase inválida. Verifique as configurações.'
          break
        default:
          errorMessage = error.message || 'Erro ao criar conta'
      }
      
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao fazer logout',
      }
    }
  }

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser
  }

  async getIdToken(): Promise<string | null> {
    const user = auth.currentUser
    if (!user) return null
    
    try {
      return await user.getIdToken()
    } catch (error) {
      console.error('Erro ao obter token:', error)
      return null
    }
  }

  async getIdTokenForceRefresh(): Promise<string | null> {
    const user = auth.currentUser
    if (!user) return null
    
    try {
      return await user.getIdToken(true)
    } catch (error) {
      console.error('Erro ao obter token:', error)
      return null
    }
  }

  onAuthStateChange(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback)
  }
}

export const firebaseAuth = new FirebaseAuthService()
