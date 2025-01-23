import type { AuthStrategy } from 'payload'

import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers.js'

export const strategy: AuthStrategy = {
	name: 'totp',
	authenticate: async (args) => {
		const { payload } = args
		// console.log('payload', payload)
		const cookieStore = await cookies()
		const token = cookieStore.get(`${payload.config.cookiePrefix}-totp`)

		if (!token) {
			return {
				user: null,
			}
		}

		let userId: string
		let originalStrategyName: string

		try {
			const result = jwt.verify(token.value, payload.secret) as {
				originalStrategy: string
				userId: string
			}

			userId = result.userId
			originalStrategyName = result.originalStrategy
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			// TODO: Log it
			return {
				user: null,
			}
		}

		const originalStrategy = payload.authStrategies.find(
			(strategy) => strategy.name === originalStrategyName,
		)

		if (!originalStrategy) {
			return {
				user: null,
			}
		}

		const originalStrategyResult = await originalStrategy.authenticate(args)

		if (originalStrategyResult.user?.id === userId) {
			const user = {
				user: {
					...originalStrategyResult.user,
					_strategy: 'totp',
				},
			}
			console.log('user in strategy', user)
			return user
		} else {
			return {
				user: null,
			}
		}
	},
}
