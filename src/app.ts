import Fastify from 'fastify'
import cookie from '@fastify/cookie'

import { mealRoutes } from './routes/meals'
import { loginRoute } from './routes/login'
import { userRoutes } from './routes/user'

export const app = Fastify()

app.register(userRoutes, {
  prefix: 'user',
})

app.register(loginRoute, {
  prefix: 'login',
})
app.register(mealRoutes, {
  prefix: 'meal',
})

app.register(cookie)
