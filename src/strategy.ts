import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers.js'
import type { AuthStrategy } from 'payload'

export const strategy: AuthStrategy = {
  name: 'totp',
  authenticate: async (args) => {
    const { payload } = args
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
        userId: string
        originalStrategy: string
      }

      userId = result.userId
      originalStrategyName = result.originalStrategy
    } catch (err) {
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
      return {
        user: {
          ...originalStrategyResult.user,
          _strategy: 'totp',
        },
      }
    } else
      return {
        user: null,
      }
  },
}
