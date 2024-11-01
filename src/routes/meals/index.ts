import { FastifyInstance } from 'fastify'
import { checkIfUserIsLoggedIn } from '../../../middlewares/check-if-user-is-logged-in'
import { z } from 'zod'
import { knex } from '../../database'
import { randomUUID } from 'crypto'
import { HttpStatusCode } from '../../constants'
import { validateIdParamFromRequest } from './helpers'

export const mealRoutes = async (app: FastifyInstance) => {
  app.addHook('preHandler', checkIfUserIsLoggedIn)

  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string().optional(),
      date: z.string().date(),
      time: z.string().time(),
      is_part_of_diet: z.boolean().default(false),
    })

    const meal = createMealBodySchema.parse(request.body)
    const userId = request.cookies.userId

    await knex('meals').insert({
      id: randomUUID(),
      name: meal.name,
      description: meal.description,
      date: meal.date,
      time: meal.time,
      is_part_of_diet: meal.is_part_of_diet,
      user_id: userId,
    })

    return reply
      .status(HttpStatusCode.Created)
      .send({ message: 'Meal registered successfully' })
  })

  app.put('/:id', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      date: z.string().date().optional(),
      time: z.string().time().optional(),
      is_part_of_diet: z.boolean().optional(),
    })

    const userId = request.cookies.userId

    const mealDataToBeUpdated = createMealBodySchema.parse(request.body)
    const { id } = validateIdParamFromRequest(request)

    const mealToBeUpdated = await knex('meals')
      .where({ user_id: userId, id })
      .select('*')
      .first()

    if (!mealToBeUpdated) {
      return reply
        .status(HttpStatusCode.BadRequest)
        .send({ message: 'Meal not found' })
    }

    await knex('meals')
      .where({ user_id: userId, id })
      .update({
        ...mealDataToBeUpdated,
      })

    return reply
      .status(HttpStatusCode.Created)
      .send({ message: 'Meal updated successfully' })
  })

  app.delete('/:id', async (request, reply) => {
    const { id } = validateIdParamFromRequest(request)
    const userId = request.cookies.userId

    const deletedMealId = await knex('meals')
      .where({ user_id: userId, id })
      .delete()
      .returning('id')

    if (!deletedMealId) {
      return reply
        .status(HttpStatusCode.BadRequest)
        .send({ message: 'Meal not found' })
    }

    return reply.status(HttpStatusCode.NoContent).send()
  })

  app.get('/', async (request, reply) => {
    const userId = request.cookies.userId
    const userMeals = await knex('meals')
      .where('user_id', userId)
      .select(['id', 'name', 'description', 'date', 'time', 'is_part_of_diet'])

    return reply.status(HttpStatusCode.OK).send({ meals: userMeals })
  })

  app.get('/:id', async (request, reply) => {
    const { id } = validateIdParamFromRequest(request)

    const userId = request.cookies.userId
    const userMeal = await knex('meals')
      .where({ user_id: userId, id })
      .select(['name', 'description', 'date', 'time', 'is_part_of_diet'])
      .first()

    return reply.status(HttpStatusCode.OK).send({ meal: userMeal })
  })
}
