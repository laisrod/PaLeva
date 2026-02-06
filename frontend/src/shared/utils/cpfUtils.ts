/**
 * Formata um CPF no padrão 000.000.000-00
 * @param value - Valor do CPF (com ou sem formatação)
 * @returns CPF formatado
 */
export function formatCPF(value: string): string {
  // Remove tudo que não é dígito
  const cpf = value.replace(/\D/g, '')
  
  // Aplica a formatação
  if (cpf.length <= 11) {
    return cpf
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  return value
}
