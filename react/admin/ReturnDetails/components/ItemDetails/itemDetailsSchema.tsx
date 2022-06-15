import type { ReactElement } from 'react'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import type { ReturnRequestItem } from 'vtex.return-app'
import { FormattedCurrency } from 'vtex.format-currency'

import type { ItemStatusInterface } from './ItemDetailsList'
import { AlignItemRight } from '../AlignItemRight'
import { ItemVerificationStatus } from './ItemVerificationStatus'

const StrongChunk = (chunks: ReactElement) => <b>{chunks}</b>

export const itemDetailsSchema = (
  itemVerificationStatus: Map<number, ItemStatusInterface>
) => ({
  properties: {
    imageUrl: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.table.header.product" />
      ),
      width: 80,
      cellRenderer: function ProductImage({
        cellData,
        rowData,
      }: {
        cellData: ReturnRequestItem['imageUrl']
        rowData: ReturnRequestItem
      }) {
        return <img src={cellData} alt={rowData.name} />
      },
    },
    name: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.table.header.product-info" />
      ),
      minWidth: 500,
      cellRenderer: function ProductName({
        cellData,
        rowData,
      }: {
        cellData: ReturnRequestItem['name']
        rowData: ReturnRequestItem
      }) {
        const { refId, returnReason, sellerName } = rowData

        return (
          <div className="mv4">
            <span className="mv2">{cellData}</span>
            <div className="mv2">
              <FormattedMessage
                id="admin/return-app.return-request-details.table.product-info.ref-id"
                values={{
                  refId,
                  b: StrongChunk,
                }}
              />
            </div>
            <div className="mv2">
              <FormattedMessage
                id="admin/return-app.return-request-details.table.product-info.reason"
                values={{
                  reason: returnReason.otherReason ?? returnReason.reason,
                  b: StrongChunk,
                }}
              />
            </div>
            <div className="mv2">
              <FormattedMessage
                id="admin/return-app.return-request-details.table.product-info.sold-by"
                values={{
                  seller: sellerName,
                  b: StrongChunk,
                }}
              />
            </div>
          </div>
        )
      },
    },
    quantity: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.table.header.quantity" />
      ),
      width: 80,
    },
    sellingPrice: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.table.header.unit-price" />
      ),
      width: 90,
      headerRight: true,
      cellRenderer: function UnitPrice({
        cellData,
      }: {
        cellData: ReturnRequestItem['sellingPrice']
      }) {
        // TODO: Refactor this with right currency symbol and locale
        return (
          <AlignItemRight>
            <FormattedCurrency value={cellData / 100} />
          </AlignItemRight>
        )
      },
    },
    tax: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.table.header.tax" />
      ),
      width: 90,
      headerRight: true,
      cellRenderer: function Tax({
        cellData,
      }: {
        cellData: ReturnRequestItem['tax']
      }) {
        // TODO: Refactor this with right currency symbol and locale
        return (
          <AlignItemRight>
            <FormattedCurrency value={cellData / 100} />
          </AlignItemRight>
        )
      },
    },
    totalItems: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.table.header.total-price" />
      ),
      width: 90,
      headerRight: true,
      cellRenderer: function TotalPrice({
        rowData,
      }: {
        rowData: ReturnRequestItem
      }) {
        const { sellingPrice, tax, quantity } = rowData

        return (
          <AlignItemRight>
            <FormattedCurrency
              value={((sellingPrice + tax) * quantity) / 100}
            />
          </AlignItemRight>
        )
      },
    },
    verificationStatus: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.table.header.verification-status" />
      ),
      cellRenderer: function VerificationStatus({
        rowData,
      }: {
        rowData: ReturnRequestItem
      }) {
        const { orderItemIndex } = rowData
        const itemStatus = itemVerificationStatus.get(orderItemIndex)

        if (!itemStatus) return null

        return <ItemVerificationStatus {...itemStatus} />
      },
    },
  },
})
