import { Metadata } from 'next'
import AuthLayout from '@/components/auth/AuthLayout'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Registro - OP TCG Tracker',
  description: 'Crea tu cuenta en OP TCG Tracker y comienza a gestionar tus partidas de One Piece TCG',
}

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Crea tu cuenta"
      subtitle="Únete a la comunidad de jugadores de One Piece TCG"
      linkText="¿Ya tienes una cuenta? Inicia sesión aquí"
      linkHref="/login"
    >
      <RegisterForm />
    </AuthLayout>
  )
} 