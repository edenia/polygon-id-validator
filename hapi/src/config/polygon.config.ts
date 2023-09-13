export const hapiHostDomain = process.env.HAPI_HOST_DOMAIN || 'http://hapi:9090'
export const polygonNetwork = process.env.HAPI_POLYGON_NETWORK || 'mumbai'
export const issuerPublicKey = process.env.HAPI_ISSUER_PUBLIC_KEY || '2...'
export const contractAddress =
  process.env.HAPI_CONTRACT_ADDRESS ||
  '0x134B1BE34911E39A8397ec6289782989729807a4'

export const rpcAlchemyUrl =
  process.env.HAPI_RPC_URL || 'https://polygon-mumbai.g.alchemy.com'
export const alchemyKey = process.env.HAPI_ALCHEMY_KEY || 'access_key'
export const ipfsNodeUrl = process.env.HAPI_IPFS_NODE_URL || 'https://ipfs.io'

if (!process.env.HAPI_PROOF_REQUEST) {
  throw new Error('Missing required proof request or wrong format')
}

// TODO: import it from .env
export const proofRequest = {
  circuitId: 'credentialAtomicQuerySigV2',
  id: 1694556023,
  query: {
    allowedIssuers: [
      'did:polygonid:polygon:mumbai:2qNYpa3KcroDtAG8hmyNF5uesQndakeEgWaxCeVRJ6'
    ],
    context:
      'https://raw.githubusercontent.com/edenia/issuer-node/main/json_test/CourseCertificateAttendance.json-ld',
    credentialSubject: { 'course-name': { $eq: 'Blockchain' } },
    type: 'course-certificate'
  }
}
