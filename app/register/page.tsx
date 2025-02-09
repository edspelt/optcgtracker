import AuthLayout from '@/components/auth/AuthLayout'
import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Crea tu cuenta"
      subtitle="Únete a la comunidad de TCG Tracker"
      linkText="¿Ya tienes una cuenta? Inicia sesión"
      linkHref="/login"
    >
      <RegisterForm />
    </AuthLayout>
  )
} 