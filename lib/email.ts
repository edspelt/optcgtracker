export async function sendPasswordResetEmail(email: string, token: string) {
  // Aquí implementarías el envío real del email usando servicios como
  // SendGrid, Amazon SES, etc.
  console.log('Sending password reset email to:', email, 'with token:', token)
} 