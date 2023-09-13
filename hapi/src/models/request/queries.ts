import { gql } from 'graphql-request'

import { coreUtil } from '../../utils'
import { Request } from './interfaces'

interface RequestResponse {
  request: Request[]
}

interface RequestInsertOneResponse {
  insert_request_one: {
    session_id: string
  }
}

export const save = async (input: Request) => {
  const mutation = gql`
    mutation ($payload: request_insert_input!) {
      insert_request_one(object: $payload) {
        session_id
      }
    }
  `

  const data = await coreUtil.hasura.default.request<RequestInsertOneResponse>(
    mutation,
    {
      payload: input
    }
  )

  return data.insert_request_one
}

export const update = async (input: Request) => {
  const mutation = gql`
    mutation ($session_id: uuid!, $payload: request_set_input) {
      update_request_by_pk(
        pk_columns: { session_id: $session_id }
        _set: $payload
      ) {
        session_id
        auth
      }
    }
  `

  await coreUtil.hasura.default.request(mutation, {
    session_id: input.session_id,
    payload: {
      auth: input.auth
    }
  })
}

export const getState = async () => {
  const query = gql`
    query {
      request(
        where: { session_id: { _neq: "00000000-0000-0000-0000-000000000000" } }
        limit: 1
      ) {
        session_id
        auth
      }
    }
  `
  const data = await coreUtil.hasura.default.request<RequestResponse>(query)

  if (!data.request.length) {
    return
  }

  return data.request[0]
}

export const get = async (sessionId: string) => {
  const query = gql`
    query ($session_id: uuid!) {
      request(where: { session_id: { _eq: $session_id } }, limit: 1) {
        session_id
        auth
      }
    }
  `
  const data = await coreUtil.hasura.default.request<RequestResponse>(query, {
    session_id: sessionId
  })

  return data.request.length > 0 ? data.request[0] : null
}

export const saveOrUpdate = async (input: Request) => {
  const request = await getState()

  if (!request) {
    await save(input)

    return
  }

  await update(input)
}
