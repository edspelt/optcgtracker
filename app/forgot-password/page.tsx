import { Metadata } from 'next'
import AuthLayout from '@/components/auth/AuthLayout'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Recuperar Contraseña - OP TCG Tracker',
  description: 'Recupera el acceso a tu cuenta de OP TCG Tracker',
}

export default function ForgotPasswordPage() {
  return (
    <AuthLayout 
      title="Recuperar contraseña"
      subtitle="Te enviaremos un enlace para restablecer tu contraseña"
      linkText="Volver al inicio de sesión"
      linkHref="/login"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
} 