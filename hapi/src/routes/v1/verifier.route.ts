import { Server, Request /* ResponseToolkit */ } from '@hapi/hapi'
// import Joi from 'joi'
import Boom from '@hapi/boom'

import { authService } from '../../services'

export const routes = (server: Server, parentRoute: string) => {
  // OPTIONAL: move to FE
  // api/v1/sign-in
  server.route({
    method: 'POST',
    path: `${parentRoute}/sign-in`,
    handler: async (/* request: Request, h: ResponseToolkit */) => {
      try {
        const response = await authService.getAuthRequest()

        return { res: !!response, data: response }
      } catch (e) {
        throw Boom.badRequest(`Error when trying to signing in (${e})`)
      }
    },
    options: {
      auth: false
    }
  })

  server.route({
    method: 'POST',
    path: `${parentRoute}/callback`,
    handler: async (request: Request /* h: ResponseToolkit */) => {
      try {
        const response = await authService.callback(request)

        return { res: !!response, data: response }
      } catch (e) {
        throw Boom.badRequest(`Error when trying to callback (${e})`)
      }
    },
    options: {
      // validate: {
      //   payload: Joi.object({
      //     input: Joi.object({
      //       user: Joi.object({
      //         email: Joi.string().email().required(),
      //         firstname: Joi.string().required(),
      //         lastname: Joi.string().required(),
      //         password: Joi.string().required()
      //       }).required()
      //     }).required()
      //   }).options({ stripUnknown: true })
      // },
      auth: false
    }
  })
}
