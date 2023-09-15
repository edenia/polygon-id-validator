'use client'

import { gql, useMutation, useLazyQuery } from '@apollo/client'
import { useLocale, useTranslations } from 'next-intl'
import { AuthorizationRequestMessage } from '@0xpolygonid/js-sdk/dist/types/iden3comm/types/protocol/auth'
import { QRCodeCanvas } from 'qrcode.react'
import { useEffect } from 'react'
import Button from '@mui/material/Button'

const mutation = gql`
  mutation v1_generate_auth_request {
    v1_generate_auth_request {
      data
      res
    }
  }
`

const lazyQuery = gql`
  query on_request_updated($session_id: uuid!) {
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
  const locale = useLocale()
  const t = useTranslations('IndexPage')
  const [loadState, { loading, data }] = useLazyQuery(lazyQuery, {
    variables: { session_id },
    fetchPolicy: 'network-only'
  })

  const handleClick = async () => {
    await loadState()
  }

  return (
    <div>
      <p>
        {t('request-status', { locale })}:{' '}
        {t(data?.request[0].status || 'pending', { locale })}
      </p>

      {!loading && (!data || data?.request[0].status === 'pending') ? (
        <Button
          id='basic-button'
          variant='contained'
          onClick={handleClick}
          style={{ marginTop: '64px' }}
        >
          {t('load-button', { locale })}
        </Button>
      ) : null}
    </div>
  )
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
