import OfficeAction from '@library/officeComponents/OfficeAction'
import { OfficeProColumns } from '@library/officeComponents/types'
import { ColumnRender } from '@library/tools'
import OfficeAccountSelect from '@library/officeComponents/business/OfficeAccountSelect'
import OfficeAccountTypeSelect from '@library/officeComponents/business/OfficeAccountTypeSelect'
import { useState } from 'react'

export enum StatusEnum {
  Success = 'SUCCESS',
  Failed = 'FAILED',
  Pending = 'PENDING',
}

export const statusOptions = [
  { value: StatusEnum.Success, label: 'Success', status: 'Success' }, // status: 'Success' | 'Error' | 'Processing' | 'Warning' | 'Default';
  { value: StatusEnum.Failed, label: 'Failed', status: 'Error' },
  { value: StatusEnum.Pending, label: 'Pending', status: 'Processing' },
]

export function useColumns({ handleDetailModal, handleEditModal }) {
  const [accountInfo, setAccountInfo] = useState()

  const formColumns: OfficeProColumns[] = [
    {
      title: 'Account No.',
      dataIndex: 'accountNumber',
      renderFormItem: () => <OfficeAccountSelect />,
      fieldProps: {
        onChange(val, option) {
          setAccountInfo(option)
        },
      },
    },
    {
      title: 'Account Type',
      dataIndex: 'accountType',
      renderFormItem: () => <OfficeAccountTypeSelect accountInfo={accountInfo} />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueEnum: statusOptions,
      search: {
        transform: (value) => {
          if (value) {
            return { statusList: value === StatusEnum.Pending ? [StatusEnum.Pending] : [value] }
          }
        },
      },
    },
    {
      title: 'Apply Date',
      dataIndex: 'applyDate',
      valueType: 'dateRange',
      search: {
        transform: (value: [string, string]) => ({ startEntryDate: value[0], endEntryDate: value[1] }),
      },
    },
  ]

  const tableColumns: OfficeProColumns[] = [
    {
      title: 'Account No.',
      dataIndex: 'fromAccountNumber',
      fixed: 'left',
      ...ColumnRender.RenderAccountNo,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueEnum: statusOptions,
    },
    { title: 'Expiration Date', dataIndex: 'expirationDate', ...ColumnRender.RenderDayTime },
    {
      title: 'Amount',
      dataIndex: 'amount',
      ...ColumnRender.RenderMoney,
    },
    {
      title: 'Request Contracts',
      dataIndex: 'quantity',
      sorter: true,
      ...ColumnRender.RenderNum,
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      ...ColumnRender.RenderTZTime,
    },
    {
      title: 'Update Time',
      dataIndex: 'updateTime',
      ...ColumnRender.RenderTZTime,
    },
    {
      title: 'Action',
      valueType: 'option',
      render: (_, row) => (
        <OfficeAction
          dataSource={[
            {
              url: '', // TODO set permission url
              name: 'Edit',
              onClick: () => handleEditModal(row),
            },
            {
              url: '', // TODO set permission url
              name: 'Detail',
              onClick: () => handleDetailModal(row),
            },
            {
              url: '', // TODO set permission url
              name: 'Delete',
              danger: true,
            },
          ]}
        />
      ),
    },
  ]

  return [formColumns, tableColumns]
}
