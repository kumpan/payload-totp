import type { I18nClient } from '@payloadcms/translations'
import { Button } from '@payloadcms/ui'
import Link from 'next/link.js'

import type { CustomTranslationsKeys, CustomTranslationsObject } from 'src/i18n.js'

type Args = {
  i18n: I18nClient<CustomTranslationsObject, CustomTranslationsKeys>
  backUrl?: string
}

export default async function Setup({ i18n, backUrl }: Args) {
  let url = '/admin/setup-totp'

  if (backUrl) {
    url += `?back=${encodeURIComponent(backUrl)}`
  }

  return (
    <Button
      el="link"
      Link={Link as unknown as React.ElementType}
      url={url}
      buttonStyle="secondary"
      size="small"
    >
      {i18n.t('totpPlugin:setup:button')}
    </Button>
  )
}
