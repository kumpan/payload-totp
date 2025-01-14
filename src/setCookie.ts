import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers.js'
import { getCookieExpiration, type IncomingAuthType, type User } from 'payload'

type Args = {
  user: User
  secret: string
  cookiePrefix: string
  authConfig: Omit<IncomingAuthType, 'cookies'> & Required<Pick<IncomingAuthType, 'cookies'>>
}

export async function setCookie({ user, secret, cookiePrefix, authConfig }: Args) {
  const token = jwt.sign(
    {
      userId: user.id,
      originalStrategy: user._strategy,
    },
    secret,
    {
      expiresIn: authConfig.tokenExpiration || 7200,
    },
  )

  const sameSite =
    typeof authConfig.cookies.sameSite === 'string'
      ? (authConfig.cookies.sameSite.toLocaleLowerCase() as 'lax' | 'none' | 'strict')
      : authConfig.cookies.sameSite
        ? 'strict'
        : undefined

  const cookieStore = await cookies()

  cookieStore.set(`${cookiePrefix}-totp`, token, {
    domain: authConfig.cookies.domain ?? undefined,
    path: '/',
    httpOnly: true,
    secure: authConfig.cookies.secure,
    sameSite,
    expires: getCookieExpiration({
      seconds: authConfig.tokenExpiration || 7200,
    }),
  })
}
