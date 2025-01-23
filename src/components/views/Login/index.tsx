import { redirect } from 'next/navigation.js'
import { User } from 'payload'
import { LoginView } from './index.client.js'
export const LoginRSC = async ({ pluginOptions }) => {
	console.log('LoginRSC', pluginOptions)
	return <LoginView />
}
