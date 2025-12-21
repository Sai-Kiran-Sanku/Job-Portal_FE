import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/
const PROTECTED_PREFIXES = ['/dashboard', '/jobs']

export function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req
  const pathname = nextUrl.pathname

  // Skip static files, api routes and next internals
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next()
  }

  const token = cookies.get('access_token')?.value

  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // If user tries to access protected pages and isn't authenticated, redirect to login
  if (PROTECTED_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/')) && !token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/jobs/:path*', '/login', '/register']
}
