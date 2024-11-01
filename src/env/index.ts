import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error(_env.error.format())
  throw new Error(`Invalid Environment Variables.`)
}

export const env = envSchema.parse(process.env)
