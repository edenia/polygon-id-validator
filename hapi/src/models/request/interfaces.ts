import { AuthorizationRequestMessage } from '@0xpolygonid/js-sdk/dist/types/iden3comm/types/protocol/auth'

export interface Request {
  session_id: string
  auth: AuthorizationRequestMessage
}
