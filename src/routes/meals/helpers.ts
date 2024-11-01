import { FastifyRequest } from 'fastify'
import { z } from 'zod'

export const validateIdParamFromRequest = (request: FastifyRequest) => {
  const getMealParamsSchema = z.object({
    id: z.string().uuid(),
  })

  return getMealParamsSchema.parse(request.params)
}
