import { cookies } from 'next/headers.js'

export async function removeCookie(cookiePrefix: string) {
  const cookieStore = await cookies()
  cookieStore.delete(`${cookiePrefix}-totp`)
}
