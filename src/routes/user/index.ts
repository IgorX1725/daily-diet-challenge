import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { knex } from '../../database'
import { HttpStatusCode } from '../../constants'
import { checkIfUserIsLoggedIn } from '../../../middlewares/check-if-user-is-logged-in'
import { countMeals, findBestSequence } from './helpers'

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      username: z.string().trim().min(4, 'username is required'),
    })

    const { username } = createUserBodySchema.parse(request.body)

    const existentUser = await knex('users')
      .where('username', username)
      .select('id')
      .first()

    if (existentUser) {
      return reply.status(HttpStatusCode.Conflict).send({
        error: 'User already exists',
      })
    }

    const userId = randomUUID()

    reply.cookie('userId', userId, {
      path: '/',
      maxAge: 60 * 60 * 60 * 24 * 7, // 7 days
    })

    await knex('users').insert({
      id: userId,
      username,
    })

    return reply.status(HttpStatusCode.Created).send()
  })

  app.get(
    '/',
    {
      preHandler: [checkIfUserIsLoggedIn],
    },
    async () => {
      const users = await knex('users').select('*')

      return { users }
    },
  )

  app.get(
    '/metrics',
    {
      preHandler: [checkIfUserIsLoggedIn],
    },
    async (request, reply) => {
      const userId = request.cookies.userId

      const userMeals = await knex('meals').where('user_id', userId)

      const MealsCount = userMeals.length
      const dietMeals = countMeals(userMeals, true)
      const nonDietMeals = countMeals(userMeals, false)
      const bestSequence = findBestSequence(userMeals)

      return reply.status(HttpStatusCode.OK).send({
        MealsCount,
        dietMeals,
        nonDietMeals,
        bestSequence,
      })
    },
  )
}
