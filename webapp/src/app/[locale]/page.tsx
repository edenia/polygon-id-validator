'use client'

import Link from 'next-intl/link'
import { useLocale, useTranslations } from 'next-intl'
import { Box, Button } from '@mui/material'

const Home = (): JSX.Element => {
  const locale = useLocale()
  const t = useTranslations('HomePage')

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
      <Box
        sx={{
          width: '45%',
          height: '30%',
          backgroundColor: '#f5f5f5',
          borderRadius: '16px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}
      >
        <h1 style={{ color: '#333', marginLeft: '16px' }}>
          {t('title', { locale })}{' '}
        </h1>

        <Link href='/credential'>
          <Button
            id='basic-button'
            variant='contained'
            style={{
              marginTop: '60px',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '200px',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            {t('gen-new-proof', { locale })}
          </Button>
        </Link>
      </Box>
    </div>
  )
}

export default Home
