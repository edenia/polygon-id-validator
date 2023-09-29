import * as React from 'react'
import { useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import SearchIcon from '@mui/icons-material/Search'
import { visuallyHidden } from '@mui/utils'
import { AuthorizationRequestMessage } from '@0xpolygonid/js-sdk/dist/types/iden3comm/types/protocol/auth'
import { gql, useLazyQuery } from '@apollo/client'

const getRequestQuery = gql`
  query get_request_data($limit: Int!, $offset: Int!) {
    request(limit: $limit, offset: $offset, order_by: { created_at: desc }) {
      auth
      session_id
      status
    }
    request_aggregate {
      aggregate {
        count
      }
    }
  }
`

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

export interface RequestResponse {
  request: Request[]
  request_aggregate: {
    aggregate: {
      count: number
    }
  }
}

interface HeadCell {
  disablePadding: boolean
  id: keyof Request
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'session_id',
    numeric: false,
    disablePadding: false,
    label: 'Proof Id'
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'Status'
  }
]

const EnhancedTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default function EnhancedTable() {
  const locale = useLocale()
  const t = useTranslations('CredentialPage')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage] = React.useState(5)
  const [loadQuery, { data }] = useLazyQuery<RequestResponse>(getRequestQuery, {
    variables: { limit: rowsPerPage, offset: page * rowsPerPage },
    fetchPolicy: 'network-only'
  })

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)

    loadQuery({
      variables: { limit: rowsPerPage, offset: newPage * rowsPerPage }
    })
  }

  useEffect(() => {
    if (!data) {
      return
    }

    console.log(data)
  }, [data])

  useEffect(() => {
    loadQuery()
  }, [loadQuery])

  return (
    <Box sx={{ width: '70%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            // sx={{ minWidth: 200 }}
            aria-labelledby='tableTitle'
            size={'medium'}
          >
            <EnhancedTableHead />
            {data ? (
              <TableBody>
                {data?.request.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={row.session_id}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell
                        component='th'
                        id={labelId}
                        scope='row'
                        padding='normal'
                      >
                        {row.session_id.toString().substring(0, 8)}
                      </TableCell>
                      <TableCell align='right'>{row.status}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            ) : (
              <Typography
                variant='caption'
                style={{
                  fontSize: '16px',
                  marginLeft: '8px'
                }}
              >
                {t('no-data', { locale })}
              </Typography>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5]}
          component='div'
          count={data?.request_aggregate.aggregate.count || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </Box>
  )
}
