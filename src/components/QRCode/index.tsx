import type { TOTP } from 'otpauth'
import { toDataURL } from 'qrcode'

import styles from './index.module.css'

type Args = {
  totp: TOTP
}

export default async function QRCode({ totp }: Args) {
  const src = await toDataURL(totp.toString(), {
    margin: 0,
    color: {
      dark: '#fff',
      light: '#00000000',
    },
  })

  return <img className={styles.root} src={src} width={196} height={196} alt="2FA QR Code" />
}
