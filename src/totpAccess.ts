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
      req: { user, payload },
    } = args

    if (!Boolean(user)) {
      return false
    }

    if (pluginOptions.forceSetup && user!._strategy === 'totp') {
      if (originalAccess) {
        return originalAccess(args)
      } else {
        return true
      }
    } else {
      const tokenSecret = await getTotpSecret(user!, payload)

      if (Boolean(tokenSecret)) {
        if (user!._strategy === 'totp') {
          if (originalAccess) {
            return originalAccess(args)
          } else {
            return true
          }
        } else return false
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
