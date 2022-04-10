import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import type {
  OrdersToReturnList,
  QueryOrdersAvailableToReturnArgs,
} from 'vtex.return-app'
import {
  ContentWrapper,
  BaseLoading,
  SkeletonPiece,
  SkeletonBox,
} from 'vtex.my-account-commons'
import { FormattedMessage } from 'react-intl'

import ORDERS_AVAILABLE_TO_RETURN from './graphql/getOrdersAvailableToReturn.gql'
import { OrderList } from './components/OrderList'

const headerConfig = {
  namespace: 'vtex-account__return-order-list',
  title: <FormattedMessage id="store/return-app.request-return.page.header" />,
  titleId: 'store/return-app.request-return.page.header"',
  backButton: {
    titleId: 'store/return-app.link',
    path: '/my-returns',
  },
}

export const OrdersAvailableToRMA = () => {
  const [mergeData, setMergeData] = useState<OrdersToReturnList[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)

  const { data, loading, error, fetchMore } = useQuery<
    { ordersAvailableToReturn: OrdersToReturnList },
    QueryOrdersAvailableToReturnArgs
  >(ORDERS_AVAILABLE_TO_RETURN, {
    variables: {
      page: 1,
    },
  })

  useEffect(() => {
    if (data) {
      setMergeData([data.ordersAvailableToReturn])
    }
  }, [data])

  useEffect(() => {
    if (data) {
      setMergeData([data.ordersAvailableToReturn])
    }
  }, [data])

  const handlePagination = (page: number, operation: string) => {
    const alreadyFetched = mergeData.find((ordersItem) => {
      return ordersItem.paging?.currentPage === page
    })

    if (!alreadyFetched) {
      fetchMore({
        variables: {
          page,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult

          setMergeData((prevState) => [
            ...prevState,
            fetchMoreResult.ordersAvailableToReturn,
          ])

          setCurrentPage(
            Number(fetchMoreResult.ordersAvailableToReturn.paging?.currentPage)
          )

          return prevResult
        },
      })
    } else {
      operation === '+'
        ? setCurrentPage((prevState) => prevState + 1)
        : setCurrentPage((prevState) => prevState - 1)
    }
  }

  return (
    <>
      {loading || error ? (
        <BaseLoading
          queryData={{ loading, error, fetchMore }}
          headerConfig={headerConfig}
        >
          <SkeletonBox shouldAllowGrowing shouldShowLowerButton>
            <SkeletonPiece height={40} />
          </SkeletonBox>
        </BaseLoading>
      ) : !mergeData.length ? null : (
        <ContentWrapper {...headerConfig}>
          {() => (
            <OrderList
              orders={mergeData[currentPage - 1]}
              handlePagination={handlePagination}
            />
          )}
        </ContentWrapper>
      )}
    </>
  )
}
