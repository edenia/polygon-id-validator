import { Request } from '@hapi/hapi'
import { auth, resolver } from '@iden3/js-iden3-auth'
import {
  DocumentLoader,
  getDocumentLoader
} from '@iden3/js-jsonld-merklization'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

import { requestModel } from '../models'
import { polygonConfig } from '../config'

export const getAuthRequest = async () => {
  const sessionId = uuidv4()
  const callbackURL = '/api/v1/callback'
  const audience = `did:polygonid:polygon:${polygonConfig.polygonNetwork}:${polygonConfig.issuerPublicKey}`

  const uri = `${polygonConfig.hapiHostDomain}${callbackURL}?sessionId=${sessionId}`

  const request = auth.createAuthorizationRequest('test flow', audience, uri)

  request.id = '7f38a193-0918-4a48-9fac-36adfdb8b542'
  request.thid = '7f38a193-0918-4a48-9fac-36adfdb8b542'

  const scope = request.body.scope ?? []
  request.body.scope = [...scope, polygonConfig.proofRequest]

  await requestModel.queries.save({ session_id: sessionId, auth: request })

  return request
}

export const callback = async (req: Request) => {
  const sessionId = req.query.sessionId
  const tokenStr = req.payload.toString()
  const ethURL = `${polygonConfig.rpcAlchemyUrl}/v2/${polygonConfig.alchemyKey}`
  const ethStateResolver = new resolver.EthStateResolver(
    ethURL,
    polygonConfig.contractAddress
  )

  const resolvers = {
    [`polygon:${polygonConfig.polygonNetwork}`]: ethStateResolver
  }

  const schemaLoader: DocumentLoader = getDocumentLoader({
    ipfsNodeURL: polygonConfig.ipfsNodeUrl
  })

  const verifier = await auth.Verifier.newVerifier({
    stateResolver: resolvers,
    circuitsDir: path.join(__dirname, './keys'),
    documentLoader: schemaLoader
  })

  const request = await requestModel.queries.get(sessionId)

  if (!request) throw new Error('Invalid session ID')

  const opts = {
    acceptedStateTransitionDelay: 5 * 60 * 1000, // 5 minutes
    acceptedProofGenerationDelay: 10 * 365 * 24 * 60 * 60 * 1000 // 10 years
  }

  const response = await verifier.fullVerify(tokenStr, request.auth, opts)
  const message = `User with ID: ${response.from} succesfully authenticated`

  request.status = requestModel.interfaces.Status.success

  await requestModel.queries.update(request)

  return message
}
