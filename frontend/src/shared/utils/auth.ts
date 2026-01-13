//Utilitários para autenticação e verificação de roles
 

export type UserRole = boolean // true = owner, false = client

export interface User {
  id: number
  email: string
  name: string
  role: UserRole
  establishment?: {
    id: number
    code: string
    name: string
  }
}

/**
 * Converte role boolean para string (para localStorage)
 */
export const roleToString = (role: UserRole): 'owner' | 'client' => {
  return role === true ? 'owner' : 'client'
}

/**
 * Converte role string para boolean (de localStorage)
 */
export const stringToRole = (role: string | null): UserRole | null => {
  if (role === 'owner') return true
  if (role === 'client') return false
  return null
}

/**
 * Verifica se o usuário é proprietário
 */
export const isOwner = (role: UserRole | null | undefined): boolean => {
  return role === true
}

/**
 * Verifica se o usuário é cliente
 */
export const isClient = (role: UserRole | null | undefined): boolean => {
  return role === false
}

/**
 * Obtém o role do localStorage (retorna boolean ou null)
 */
export const getStoredRole = (): UserRole | null => {
  const roleString = localStorage.getItem('user_role')
  return stringToRole(roleString)
}

/**
 * Salva o role no localStorage (aceita boolean ou string)
 */
export const setStoredRole = (role: UserRole | string): void => {
  const roleBoolean = typeof role === 'boolean' ? role : stringToRole(role) ?? false
  localStorage.setItem('user_role', roleToString(roleBoolean))
}

/**
 * Limpa todos os dados de autenticação do localStorage
 */
export const clearAuthStorage = (): void => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_role')
  localStorage.removeItem('establishment_code')
}

/**
 * Salva dados do usuário no localStorage
 */
export const saveUserData = (user: User): void => {
  setStoredRole(user.role)
  if (user.establishment?.code) {
    localStorage.setItem('establishment_code', user.establishment.code)
  }
}

/**
 * Obtém dados do usuário do localStorage (parcial)
 */
export const getStoredUserData = (): Partial<User> | null => {
  const role = getStoredRole()
  const establishmentCode = localStorage.getItem('establishment_code')
  
  if (role === null) return null
  
  return {
    role,
    establishment: establishmentCode ? {
      code: establishmentCode,
    } as User['establishment'] : undefined,
  }
}

