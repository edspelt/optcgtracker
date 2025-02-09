import { withAuth } from 'next-auth/middleware'

// Rutas que requieren ser admin
const adminRoutes = ['/admin', '/admin/users', '/admin/settings']
// Rutas que requieren ser juez o admin
const judgeRoutes = ['/tournaments/manage', '/matches/pending']

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Verificar permisos de admin
    if (adminRoutes.some(route => path.startsWith(route)) && token?.role !== 'ADMIN') {
      return Response.redirect(new URL('/dashboard', req.url))
    }

    // Verificar permisos de juez/admin
    if (judgeRoutes.some(route => path.startsWith(route)) && 
        !['ADMIN', 'JUDGE'].includes(token?.role as string)) {
      return Response.redirect(new URL('/dashboard', req.url))
    }

    return null
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/matches/:path*',
    '/tournaments/:path*',
    '/admin/:path*',
    '/profile/:path*'
  ]
} 