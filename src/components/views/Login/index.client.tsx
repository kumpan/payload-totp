'use client'
import type { User } from 'payload'

import { redirect } from 'next/navigation.js'
import React, { Fragment, useEffect } from 'react'

// import { LoginForm } from './Form.js'
import { useAuth } from '@payloadcms/ui'
import { formatAdminURL } from '@payloadcms/ui/shared'

export const LoginView: React.FC = ({ searchParams, user: propUser }) => {
	console.log('LoginView client', propUser)
	const customSearchParams = {
		redirect: '/verify-otp',
	}
	const { token, user } = useAuth<User>()

	useEffect(() => {
		console.log('useEffect LoginView')
		if (user && window.location.pathname !== '/admin/verify-totp') {
			console.log('redirecting to /admin/verify-totp', user)
			redirect('/admin/verify-totp?back=/admin')
		}
	}, [user])
	return (
		<Fragment>
			<p>Login form goes here</p>
			{/* <LoginForm searchParams={searchParams} /> */}
		</Fragment>
	)
}
