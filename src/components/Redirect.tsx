'use client'

import { redirect, usePathname } from 'next/navigation.js'

type Args = {
  children: React.ReactNode
  redirect?: string
  includeBack?: boolean
}

export default function Redirect({ redirect: redirectValue, children, includeBack }: Args) {
  const pathname = usePathname()

  if (redirectValue && redirectValue !== pathname) {
    let url = redirectValue

    if (includeBack) {
      url = url + `?back=${encodeURIComponent(pathname)}`
    }

    redirect(url)
  }

  return children
}
