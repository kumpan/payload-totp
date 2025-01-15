import type { Payload, User } from 'payload'

export async function getTotpSecret(user: User, payload: Payload): Promise<string | undefined> {
	if (!user) {
		return undefined
	}

	if ('totpSecret' in user && Boolean(user.totpSecret)) {
		return user.totpSecret
	}

	const { totpSecret } = await payload.findByID({
		id: user.id,
		collection: user.collection,
		overrideAccess: true,
		select: {
			totpSecret: true,
		},
		showHiddenFields: true,
	})

	return totpSecret as string | undefined
}
