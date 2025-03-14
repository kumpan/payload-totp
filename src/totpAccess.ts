import type { Access } from 'payload'

import type { PayloadTOTPConfig } from './types.js'

import { getTotpSecret } from './utilities/getTotpSecret.js'

type Args = {
	originalAccess?: Access
	pluginOptions: PayloadTOTPConfig
}

export const totpAccess: (args: Args) => Access = (outerFnArgs) => {
	const { originalAccess, pluginOptions } = outerFnArgs

	return async (args) => {
		const {
			req: { payload, user },
		} = args

		if (!user) {
			return false
		}

		// TODO: Report `user as any` to Payload
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (pluginOptions.forceSetup && (user as any)._strategy === 'totp') {
			if (originalAccess) {
				return originalAccess(args)
			} else {
				return true
			}
		} else {
			const tokenSecret = await getTotpSecret(user, payload)

			if (tokenSecret) {
				// TODO: Report `user as any` to Payload
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				if ((user as any)._strategy === 'totp') {
					if (originalAccess) {
						return originalAccess(args)
					} else {
						return true
					}
				} else {
					return false
				}
			} else {
				if (originalAccess) {
					return originalAccess(args)
				} else {
					return true
				}
			}
		}
	}
}
