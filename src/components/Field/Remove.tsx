import type { I18nClient } from '@payloadcms/translations'
import { Modal } from '@payloadcms/ui'
import type { Payload, User } from 'payload'

import type { CustomTranslationsKeys, CustomTranslationsObject } from 'src/i18n.js'
import RemoveButton from './RemoveButton.js'
import { Remove as RemoveView } from '../views/Remove/index.js'
import { PayloadTOTPConfig } from 'src/types.js'

const modalSlug = 'remove-totp'

type Args = {
  pluginOptions: PayloadTOTPConfig
  payload: Payload
  user: User
  i18n: I18nClient<CustomTranslationsObject, CustomTranslationsKeys>
}

export default async function Remove({ i18n, user, payload, pluginOptions }: Args) {
  return (
    <>
      <RemoveButton modalSlug={modalSlug}>{i18n.t('general:remove')}</RemoveButton>
      <Modal slug={modalSlug}>
        <RemoveView i18n={i18n} user={user} payload={payload} pluginOptions={pluginOptions} />
      </Modal>
    </>
  )
}
