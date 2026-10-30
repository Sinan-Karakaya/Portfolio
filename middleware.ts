import { NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages } from './app/i18n/settings'

acceptLanguage.languages(languages)

export const config = {
  // matcher: '/:lng*'
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|robots.txt|sitemap.xml).*)']
}

const cookieName = 'i18next'

export function middleware(req: any) {
  let lng
  if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req.cookies.get(cookieName).value)
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng

  // Redirect if lng in path is not supported
  if (
    !languages.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}`, req.url))
  }

  // Remember the language of the page being viewed, so the language switch sticks.
  const lngInPath = languages.find((l) => req.nextUrl.pathname === `/${l}` || req.nextUrl.pathname.startsWith(`/${l}/`))
  const response = NextResponse.next()
  if (lngInPath && req.cookies.get(cookieName)?.value !== lngInPath) response.cookies.set(cookieName, lngInPath)
  return response
}