import type { ApolloError } from 'apollo-client'
import { defineMessages } from 'react-intl'
import type { OrderToReturnValidation } from 'vtex.return-app'

import { ORDER_TO_RETURN_VALIDATON } from './constants'

type CodeError =
  | 'UNKNOWN_ERROR'
  | 'E_HTTP_404'
  | 'FORBIDDEN'
  | OrderToReturnValidation

const { ORDER_NOT_INVOICED, OUT_OF_MAX_DAYS } = ORDER_TO_RETURN_VALIDATON

export const getErrorCode = (error: ApolloError): CodeError => {
  const { graphQLErrors } = error

  if (!graphQLErrors.length) {
    return 'UNKNOWN_ERROR'
  }

  const [{ extensions }] = graphQLErrors

  const { code } = extensions?.exception ?? {}

  const knownErrors = [
    ORDER_NOT_INVOICED,
    OUT_OF_MAX_DAYS,
    // order not found
    'E_HTTP_404',
    // userId on session doesn't match with userId on order profile
    'FORBIDDEN',
  ] as const

  const knownError = knownErrors.find((errorCode) => errorCode === code)

  return knownError ?? 'UNKNOWN_ERROR'
}

export const errorMessages = defineMessages({
  [ORDER_NOT_INVOICED]: {
    id: 'store/return-app.return-order-details.error.order-not-invoiced',
  },
  [OUT_OF_MAX_DAYS]: {
    id: 'store/return-app.return-order-details.error.out-of-max-days',
  },
  E_HTTP_404: {
    id: 'store/return-app.return-order-details.error.order-not-found',
  },
  FORBIDDEN: {
    id: 'store/return-app.return-order-details.error.forbidden',
  },
  UNKNOWN_ERROR: {
    id: 'store/return-app.return-order-details.error.unknown',
  },
})
