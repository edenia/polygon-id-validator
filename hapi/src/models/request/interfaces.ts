import { AuthorizationRequestMessage } from '@0xpolygonid/js-sdk/dist/types/iden3comm/types/protocol/auth'

export const Status = {
  pending: 'pending',
  success: 'success'
} as const

export type StatusType = (typeof Status)[keyof typeof Status]

export interface Request {
  session_id: string
  auth: AuthorizationRequestMessage
  status?: StatusType
}
