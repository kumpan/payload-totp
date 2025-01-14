import { MinimalTemplate } from '@payloadcms/next/templates'
import type { I18nClient } from '@payloadcms/translations'
import type { Payload, User } from 'payload'

import type { CustomTranslationsKeys, CustomTranslationsObject } from 'src/i18n.js'
import { PayloadTOTPConfig } from 'src/types.js'
import Form from './Form.js'

import styles from './index.module.css'

type Args = {
  pluginOptions: PayloadTOTPConfig
  payload: Payload
  user: User
  i18n: I18nClient<CustomTranslationsObject, CustomTranslationsKeys>
}

export const Remove: React.FC<Args> = async (args) => {
  const { i18n, pluginOptions } = args

  return (
    <MinimalTemplate className={styles.root}>
      <h1>{i18n.t('totpPlugin:verify:title')}</h1>
      <p>
        {i18n
          .t('totpPlugin:setup:enterCode')
          .replace('{digits}', (pluginOptions.totp?.digits || 6).toString())}
      </p>
      <Form length={pluginOptions.totp?.digits} />
    </MinimalTemplate>
  )
}
