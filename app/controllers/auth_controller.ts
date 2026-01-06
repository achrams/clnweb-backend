import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    const { email, password } = request.body()
    try {
      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user)
      console.log({user})
      return { user, token }
    } catch (error) {
      console.error(error)
      return response.unauthorized({ error })
    }
  }
}
