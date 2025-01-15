/* eslint-disable no-restricted-exports */

'use client'

import { redirect, usePathname } from 'next/navigation.js'

type Args = {
	children: React.ReactNode
	includeBack?: boolean
	redirect?: string
}

export default function Redirect({ children, includeBack, redirect: redirectValue }: Args) {
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
