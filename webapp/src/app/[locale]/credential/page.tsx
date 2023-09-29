'use client'

import React from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { gql, useMutation, useLazyQuery } from '@apollo/client'
import { AuthorizationRequestMessage } from '@0xpolygonid/js-sdk/dist/types/iden3comm/types/protocol/auth'
import { QRCodeCanvas } from 'qrcode.react'
import { Button, Alert } from '@mui/material'
import { useEffect } from 'react'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ReplayIcon from '@mui/icons-material/Replay'
import TableCredentialComponent from '../components/TableCredential'
import Snackbar from '@mui/material/Snackbar'

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

const RequestResolvedComponent = ({ session_id }: RequestResolvedProps) => {
  const locale = useLocale()
  const t = useTranslations('IndexPage')
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const [loadState, { loading, data }] = useLazyQuery(lazyQuery, {
    variables: { session_id },
    fetchPolicy: 'network-only'
  })

  const handleClick = async () => {
    await loadState()

    setSnackbarOpen(true)
  }

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setSnackbarOpen(false)
  }

  return (
    <div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={
            data?.request[0].status == 'success' ? 'success' : 'warning'
          }
          sx={{ width: '100%' }}
        >
          {t('request-status', { locale })}:{' '}
          {t(data?.request[0].status || 'pending', { locale })}
        </Alert>
      </Snackbar>

      <div style={{ marginTop: '24px' }}>
        <Button
          id='basic-button'
          variant='contained'
          size='small'
          onClick={handleClick}
        >
          {t('load-button', { locale })}
        </Button>
      </div>
    </div>
  )
}

const CredentialPage = (): JSX.Element => {
  const [generateRequest, { data, loading }] =
    useMutation<AuthRequest>(mutation)

  const handleReload = () => {
    generateRequest()
  }

  useEffect(() => {
    generateRequest()
  }, [generateRequest])

  return (
    <div style={{ display: 'flex', marginTop: 150, height: '90vh' }}>
      <div
        style={{
          flex: 7,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px'
        }}
      >
        {!loading && data ? (
          <>
            <div
              style={{
                flex: 7,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                style={{
                  flex: 3,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography variant='caption' style={{ fontSize: '12px' }}>
                  Proof Id:{' '}
                  {data?.v1_generate_auth_request.data.id.substring(0, 8)}
                </Typography>
                <IconButton
                  aria-label='delete'
                  size='small'
                  onClick={handleReload}
                >
                  <ReplayIcon fontSize='inherit' />
                </IconButton>
              </div>
              <QRCodeCanvas
                value={JSON.stringify(data?.v1_generate_auth_request.data)}
                size={200}
              />
              <RequestResolvedComponent
                session_id={data?.v1_generate_auth_request.data.id}
              />
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div style={{ flex: 7 }}>
        <TableCredentialComponent />
      </div>
    </div>
  )
}

export default CredentialPage
