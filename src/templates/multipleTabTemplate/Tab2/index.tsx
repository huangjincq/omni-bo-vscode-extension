import { OfficeProMultipleTable } from '@library/officeComponents'
import { OfficeProMultipleTableConfig } from '@library/officeComponents/OfficeProMultipleTable'
import React, { useEffect, useRef } from 'react'
import api from './api'
import { useColumns } from './columns'
import moment from 'moment'

export default function Tab2() {
  const [formColumns, houseTableColumns, streetTableColumns] = useColumns()

  const tableConfigs: OfficeProMultipleTableConfig[] = [
    { title: 'House', columns: houseTableColumns, request: api.list },
    { title: 'Street', columns: streetTableColumns, request: api.list2 },
  ]

  return (
    <OfficeProMultipleTable
      tableConfigs={tableConfigs}
      formColumns={formColumns}
      frontEndExport={{
        exportFileName: `ODK_PositionActivityListing_${moment().format('yyyy-MM-DD')}`,
        permissionUrl: '', // TODO set permission url
        bizType: 'RECONCILIATION',
        subBizType: 'EXPORT_ODK_POSITION_ACTIVITY_LIST',
      }}
    />
  )
}
