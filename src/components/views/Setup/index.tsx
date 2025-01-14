import { MinimalTemplate } from '@payloadcms/next/templates'
import type { I18nClient } from '@payloadcms/translations'
import { formatAdminURL } from '@payloadcms/ui/shared'
import { redirect } from 'next/navigation.js'
import { Secret, TOTP } from 'otpauth'
import type { AdminViewProps, ServerComponentProps } from 'payload'

import type { CustomTranslationsKeys, CustomTranslationsObject } from 'src/i18n.js'
import { PayloadTOTPConfig } from 'src/types.js'
import { getTotpSecret } from '../../../utilities/getTotpSecret.js'
import QRCode from '../../QRCode/index.js'
import Form from './Form.js'
import ShowSecret from './ShowSecret/index.js'

import styles from './index.module.css'

type Args = AdminViewProps &
  ServerComponentProps & {
    pluginOptions: PayloadTOTPConfig
  }

export const TOTPSetup: React.FC<Args> = async (args) => {
  const i18n = args.i18n as I18nClient<CustomTranslationsObject, CustomTranslationsKeys>
  const {
    initPageResult: {
      req: { user, payload },
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

  if (totpSecret) {
    const url = formatAdminURL({
      adminRoute: payload.config.routes.admin,
      path: '/',
    })

    redirect(url)
  }

  const secret = new Secret({
    size: 32,
  })

  const totp = new TOTP({
    issuer: pluginOptions.totp?.issuer || 'Payload',
    algorithm: pluginOptions.totp?.algorithm || 'SHA1',
    digits: pluginOptions.totp?.digits || 6,
    period: pluginOptions.totp?.period || 30,
    label: user!.email || user!.username,
    secret,
  })

  return (
    <MinimalTemplate className={styles.root}>
      <h1>{i18n.t('totpPlugin:setup:title')}</h1>
      <p
        dangerouslySetInnerHTML={{
          __html: i18n.t('totpPlugin:setup:description'),
        }}
      ></p>
      <div className={styles.qr}>
        <QRCode totp={totp} />
        <ShowSecret i18n={i18n} secret={secret.base32} />
      </div>
      <div className={styles.code}>
        <p>
          {i18n
            .t('totpPlugin:setup:enterCode')
            .replace('{digits}', (pluginOptions.totp?.digits || 6).toString())}
        </p>
        <Form
          secret={secret.base32}
          length={pluginOptions.totp?.digits}
          back={(typeof back === 'string' && back) || undefined}
        />
      </div>
    </MinimalTemplate>
  )
}
