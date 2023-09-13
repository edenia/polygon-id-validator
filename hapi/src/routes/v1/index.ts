import { Server } from '@hapi/hapi'

import * as verifierRoute from './verifier.route'

const baseRoute = '/api/v1'

export default (server: Server) => {
  verifierRoute.routes(server, baseRoute)
}
