'use client'
import { useAuth } from '@payloadcms/ui'
import { usePathname, useRouter } from 'next/navigation.js'

import type { PayloadTOTPConfig } from '../types.js'
import React, { useEffect } from 'react'
type Args = {
	children: React.ReactNode
	pluginOptions: PayloadTOTPConfig
}
// export const TOTPProvider = (args: Args) => {
// 	console.log('args', args)
// 	const { children, pluginOptions } = args
// 	const { token, user } = useAuth()
// 	const router = useRouter()
// 	const pathname = usePathname()
//
// 	console.log('provider client')
// 	useEffect(() => {
// 		console.log('provider useEffect')
// 		console.log('user', user)
// 		// If user is present and not on the TOTP page already, redirect:
// 		if (user && pathname !== '/admin/verify-totp') {
// 			console.log('redirecting to /admin/verify-totp')
// 			// router.push('/admin/verify-totp')
// 		}
// 	}, [user, pathname, router])
// 	return children
// }
