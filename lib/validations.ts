export const BANNED_WORDS = [
  'admin',
  'root',
  'system',
  // Añade aquí más palabras prohibidas
]

export const EMAIL_MAX_LENGTH = 50
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 50

export const validateEmail = (email: string): string | null => {
  if (!email) return 'El email es requerido'
  if (email.length > EMAIL_MAX_LENGTH) return `El email no puede tener más de ${EMAIL_MAX_LENGTH} caracteres`
  if (email.includes(' ')) return 'El email no puede contener espacios'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email inválido'
  if (BANNED_WORDS.some(word => email.toLowerCase().includes(word))) {
    return 'Email no permitido'
  }
  return null
}

export const validatePassword = (password: string): string | null => {
  if (!password) return 'La contraseña es requerida'
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `La contraseña no puede tener más de ${PASSWORD_MAX_LENGTH} caracteres`
  }
  if (password.includes(' ')) return 'La contraseña no puede contener espacios'
  return null
} 