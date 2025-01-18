import type { Payload, User } from 'payload'

export async function getTotpSecret(user: User, payload: Payload): Promise<string | undefined> {
	if (!user) {
		return undefined
	}

	if ('totpSecret' in user && Boolean(user.totpSecret)) {
		return user.totpSecret
	}

	const { totpSecret } = (await payload.findByID({
		id: user.id,
		collection: user.collection,
		overrideAccess: true,
		select: {
			totpSecret: true,
		},
		showHiddenFields: true,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any)) as { totpSecret?: null | string } // TODO: Report this to Payload

	return totpSecret as string | undefined
}
