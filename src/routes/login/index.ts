import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../../database'
import { HttpStatusCode } from '../../constants'

export const loginRoute = async (app: FastifyInstance) => {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      username: z.string(),
    })

    const { username } = createUserBodySchema.parse(request.body)

    const foundUser = await knex('users').where('username', username).first()

    if (!foundUser) {
      return reply.status(HttpStatusCode.NotFound).send({
        message: 'invalid username',
      })
    }

    const { id } = foundUser

    reply.cookie('userId', id, {
      path: '/',
      maxAge: 60 * 60 * 60 * 24 * 7, // 7 days
    })

    return reply
      .status(HttpStatusCode.Created)
      .send({ message: 'Login successful' })
  })
}
