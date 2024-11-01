import { app } from './app'
import { env } from './env'

app.listen(
  {
    port: env.PORT,
  },
  (err, address) => {
    if (err) throw err
    console.log(`Server is now listening on ${address}`)
  },
)
