import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../src/database'

export async function checkIfUserIsLoggedIn(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const userId = request.cookies.userId

  const foundUser = await knex('users').where('id', userId).first()

  if (!foundUser) {
    return replay.status(401).send({
      error: 'Unauthorized',
    })
  }
}
