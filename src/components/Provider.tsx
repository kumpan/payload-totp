import { formatAdminURL } from '@payloadcms/ui/shared'
import type { ServerComponentProps } from 'payload'

import type { PayloadTOTPConfig } from 'src/types.js'
import { getTotpSecret } from '../utilities/getTotpSecret.js'
import Redirect from './Redirect.js'

type Args = {
  children: React.ReactNode
  pluginOptions: PayloadTOTPConfig
} & ServerComponentProps

export const TOTPProvider = async (args: Args) => {
  const { children, user, pluginOptions, payload } = args

  const totpSecret = await getTotpSecret(user, payload)

  if (user && totpSecret && user._strategy !== 'totp') {
    const url = formatAdminURL({
      adminRoute: payload.config.routes.admin,
      path: '/verify-totp',
    })

    return (
      <Redirect redirect={url} includeBack={true}>
        {children}
      </Redirect>
    )
  } else if (user && !totpSecret && pluginOptions.forceSetup) {
    const url = formatAdminURL({
      adminRoute: payload.config.routes.admin,
      path: '/setup-totp',
    })

    return (
      <Redirect redirect={url} includeBack={true}>
        {children}
      </Redirect>
    )
  } else {
    return children
  }
}
