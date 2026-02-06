export interface RegisterFormData {
  name: string
  last_name: string
  email: string
  cpf: string
  password: string
  password_confirmation: string
}

export interface ValidationResult {
  isValid: boolean
  error: string
}

/**
 * Valida os dados do formulário de registro
 * @param formData - Dados do formulário
 * @returns Resultado da validação
 */
export function validateRegisterForm(formData: RegisterFormData): ValidationResult {
  if (!formData.name.trim()) {
    return { isValid: false, error: 'Nome é obrigatório' }
  }
  
  if (!formData.last_name.trim()) {
    return { isValid: false, error: 'Sobrenome é obrigatório' }
  }
  
  if (!formData.email.trim()) {
    return { isValid: false, error: 'Email é obrigatório' }
  }
  
  if (!formData.cpf.trim()) {
    return { isValid: false, error: 'CPF é obrigatório' }
  }
  
  if (formData.password.length < 6) {
    return { isValid: false, error: 'Senha deve ter pelo menos 6 caracteres' }
  }
  
  if (formData.password !== formData.password_confirmation) {
    return { isValid: false, error: 'As senhas não coincidem' }
  }
  
  return { isValid: true, error: '' }
}
