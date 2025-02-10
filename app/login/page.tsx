import { Metadata } from 'next'
import AuthLayout from '@/components/auth/AuthLayout'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Iniciar Sesión - OP TCG Tracker',
  description: 'Inicia sesión en OP TCG Tracker y gestiona tus partidas de One Piece TCG',
}

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión para continuar"
      linkText="¿No tienes cuenta? Regístrate aquí"
      linkHref="/register"
    >
      <LoginForm />
    </AuthLayout>
  )
} 