import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { payloadTotp } from 'payload-totp'
import { fileURLToPath } from 'url'

// import { devUser } from './helpers/credentials.js'
// import { testEmailAdapter } from './helpers/testEmailAdapter.js'
// import { seed } from './seed.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.ROOT_DIR) {
  process.env.ROOT_DIR = dirname
}

// eslint-disable-next-line no-restricted-exports
export default buildConfig({
  admin: {
    // autoLogin: devUser,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    {
      slug: 'users',
      fields: [],
      auth: true,
    },
    // {
    //   slug: 'posts',
    //   fields: [],
    // },
    // {
    //   slug: 'media',
    //   fields: [],
    //   upload: {
    //     staticDir: path.resolve(dirname, 'media'),
    //   },
    // },
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  editor: lexicalEditor(),
  //email: testEmailAdapter,
  // onInit: async (payload) => {
  //   await seed(payload)
  // },
  plugins: [
    payloadTotp({
      collection: 'users',
      forceSetup: false,
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || 'test-secret_key',
  // sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
