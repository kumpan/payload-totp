/* eslint-disable no-restricted-exports */

import type { TOTP } from 'otpauth'

import { toDataURL } from 'qrcode'

import styles from './index.module.css'

type Args = {
	totp: TOTP
}

export default async function QRCode({ totp }: Args) {
	const src = await toDataURL(totp.toString(), {
		color: {
			dark: '#fff',
			light: '#00000000',
		},
		margin: 0,
	})

	return <img alt="2FA QR Code" className={styles.root} height={196} src={src} width={196} />
}
