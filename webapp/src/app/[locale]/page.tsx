'use client'

import { gql, useMutation } from '@apollo/client'
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

type AuthRequest = {
  v1_generate_auth_request: {
    data: AuthorizationRequestMessage
    res: boolean
  }
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
      <h1>QR Code</h1>
      {!loading && data ? (
        <QRCodeCanvas
          value={JSON.stringify(data?.v1_generate_auth_request.data)}
          size={256}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default Home
