'use client'

import { gql, useMutation, useSubscription } from '@apollo/client'
import { AuthorizationRequestMessage } from '@0xpolygonid/js-sdk/dist/types/iden3comm/types/protocol/auth'
import { QRCodeCanvas } from 'qrcode.react'
import { useEffect } from 'react'

const mutation = gql`
  mutation v1_generate_auth_request {
    v1_generate_auth_request {
      data
      res
    }
  }
`

const subscription = gql`
  subscription on_request_updated($session_id: uuid!) {
    request(where: { session_id: { _eq: $session_id } }) {
      session_id
      status
    }
  }
`

type AuthRequest = {
  v1_generate_auth_request: {
    data: AuthorizationRequestMessage
    res: boolean
  }
}

interface RequestResolvedProps {
  session_id: string
}

const RequestResolvedComponent: React.FC<RequestResolvedProps> = ({
  session_id
}) => {
  const { data, loading, error } = useSubscription(subscription, {
    variables: { session_id }
  })

  useEffect(() => {
    console.log(data)
  }, [data])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return <p>Request status: {data.request[0].status}</p>
}

const Home: React.FC = () => {
  const [generateRequest, { data, loading /* error */ }] =
    useMutation<AuthRequest>(mutation)

  useEffect(() => {
    generateRequest()
  }, [generateRequest])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '96vh'
      }}
      data-testid='test-home'
    >
      <h1>Scan this QR code to get your verifiable credential validated</h1>
      {!loading && data ? (
        <>
          <QRCodeCanvas
            value={JSON.stringify(data?.v1_generate_auth_request.data)}
            size={256}
          />
          <RequestResolvedComponent
            session_id={data?.v1_generate_auth_request.data.id}
          />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default Home
