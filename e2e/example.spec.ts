import { expect, test } from '@playwright/test'
import type { Server } from 'http'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import path from 'path'
import { fileURLToPath } from 'url'

import { prepareServer } from '../dev/prepareServer'

let server: Server
let memoryDB: MongoMemoryReplSet | undefined

test.beforeAll(async () => {
	if (!process.env.DATABASE_URI) {
		memoryDB = await MongoMemoryReplSet.create({
			replSet: {
				dbName: 'payload-totp-memdb',
			},
		})

		process.env.DATABASE_URI = `${memoryDB.getUri()}&retryWrites=true`
	}

	const dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dev')
	server = await prepareServer(dirname, false)
	server.listen(3000)
})

test.afterAll(async () => {
	if (server) {
		server.close()
	}

	if (memoryDB) {
		await memoryDB.stop()
	}
})

test('has title', async ({ page }) => {
	await page.goto('http://localhost:3000/admin')
	await expect(page).toHaveTitle('Create first user - Payload')
})
