import type { I18nClient } from '@payloadcms/translations'
import { Secret, TOTP } from 'otpauth'
import type { PayloadHandler } from 'payload'

import type { CustomTranslationsKeys, CustomTranslationsObject } from 'src/i18n.js'
import { setCookie } from '../setCookie.js'
import type { PayloadTOTPConfig } from 'src/types.js'

export function setSecret(pluginOptions: PayloadTOTPConfig) {
  const handler: PayloadHandler = async (req) => {
    const { user, payload } = req
    const i18n = req.i18n as unknown as I18nClient<CustomTranslationsObject, CustomTranslationsKeys>

    if (!user) {
      return Response.json({ ok: false, message: i18n.t('error:unauthorized') })
    }

    let data: any

    try {
      data = req.json && (await req.json())
    } catch (err) {}

    if (
      typeof data !== 'object' ||
      typeof data['token'] !== 'string' ||
      typeof data['secret'] !== 'string'
    ) {
      return Response.json({ ok: false, message: i18n.t('error:unspecific') })
    }

    const totp = new TOTP({
      issuer: pluginOptions.totp?.issuer || 'Payload',
      algorithm: pluginOptions.totp?.algorithm || 'SHA1',
      digits: pluginOptions.totp?.digits || 6,
      period: pluginOptions.totp?.period || 30,
      label: user.email || user.username,
      secret: Secret.fromBase32(data['secret']),
    })

    const delta = totp.validate({ token: data['token'].toString(), window: 1 })

    if (delta === null) {
      return Response.json({ ok: false, message: i18n.t('totpPlugin:setup:incorrectCode') })
    }

    await payload.update({
      collection: user.collection,
      id: user.id,
      overrideAccess: true,
      data: {
        totpSecret: data['secret'],
      },
    })

    const collection = payload.collections[user.collection]

    await setCookie({
      user: user,
      secret: payload.secret,
      cookiePrefix: payload.config.cookiePrefix,
      authConfig: collection.config.auth,
    })

    return Response.json({ ok: true })
  }

  return handler
}

export interface IResponse {
  ok: boolean
  message?: string
}
