import type { I18nClient } from '@payloadcms/translations'
import type { AdminViewProps, ServerComponentProps } from 'payload'

import { MinimalTemplate } from '@payloadcms/next/templates'
import { formatAdminURL } from '@payloadcms/ui/shared'
import { redirect } from 'next/navigation.js'

import type { CustomTranslationsKeys, CustomTranslationsObject } from '../../../i18n.js'
import type { PayloadTOTPConfig } from '../../../types.js'

import { getTotpSecret } from '../../../utilities/getTotpSecret.js'
import Form from './Form.js'
import styles from './index.module.css'

type Args = {
	pluginOptions: PayloadTOTPConfig
} & AdminViewProps &
	ServerComponentProps

export const TOTPVerify: React.FC<Args> = async (args) => {
	const i18n = args.i18n as I18nClient<CustomTranslationsObject, CustomTranslationsKeys>
	const {
		initPageResult: {
			req: { payload, user },
		},
		pluginOptions,
		searchParams: { back },
	} = args

	if (!user) {
		const url = formatAdminURL({
			adminRoute: payload.config.routes.admin,
			path: '/login',
		})

		redirect(url)
	}

	const totpSecret = await getTotpSecret(user, payload)

	// TODO: Report `user as any` to Payload
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (!totpSecret || (totpSecret && (user as any)._strategy === 'totp')) {
		const url = formatAdminURL({
			adminRoute: payload.config.routes.admin,
			path: '/',
		})

		redirect(url)
	}

	// Redirect to setup if user has no TOTP secret
	if (!totpSecret && user && (user as any)._strategy !== 'totp') {
		console.log('TOTPVerify redirecting to /admin/setup-totp')
		const url = formatAdminURL({
			adminRoute: payload.config.routes.admin,
			path: '/setup-totp',
		})

		redirect(url)
	}
	return (
		<MinimalTemplate className={styles.root}>
			<h1>{i18n.t('totpPlugin:verify:title')}</h1>
			<p>
				{i18n
					.t('totpPlugin:setup:enterCode')
					.replace('{digits}', (pluginOptions.totp?.digits || 6).toString())}
			</p>
			<Form
				back={(typeof back === 'string' && back) || undefined}
				length={pluginOptions.totp?.digits}
			/>
		</MinimalTemplate>
	)
}
