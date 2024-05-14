import OfficeAction from '@library/officeComponents/OfficeAction'
import { OfficeProColumns } from '@library/officeComponents/types'
import { ColumnRender } from '@library/tools'
import OfficeAccountSelect from '@library/officeComponents/business/OfficeAccountSelect'
import OfficeAccountTypeSelect from '@library/officeComponents/business/OfficeAccountTypeSelect'
import { useState } from 'react'

export enum StatusEnum {
  Success = 'SUCCESS',
  Failed = 'FAILED',
  Pending = 'PENDING'
}

export const statusOptions = [
  { value: StatusEnum.Success, label: 'Success', status: 'Success' }, // status: 'Success' | 'Error' | 'Processing' | 'Warning' | 'Default';
  { value: StatusEnum.Failed, label: 'Failed', status: 'Error' },
  { value: StatusEnum.Pending, label: 'Pending', status: 'Processing' }
]

export function useColumns({
  /* start_detail */
  handleDetailModal,
  /* end_detail */
  /* start_edit */
  handleEditModal,
  /* end_edit */
  /* start_delete */
  handleDelete,
  /* end_delete */
  handleSubmit
}) {
  const [accountInfo, setAccountInfo] = useState()

  const formColumns: OfficeProColumns[] = [
    {
      title: 'Account No.',
      dataIndex: 'accountNumber',
      renderFormItem: () => <OfficeAccountSelect />,
      fieldProps: {
        onChange(val, option) {
          setAccountInfo(option)
        }
      }
    },
    {
      title: 'Account Type',
      dataIndex: 'accountType',
      renderFormItem: () => <OfficeAccountTypeSelect accountInfo={accountInfo} />
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
        }
      }
    },
    {
      title: 'Apply Date',
      dataIndex: 'applyDate',
      valueType: 'dateRange',
      search: {
        transform: (value: [string, string]) => ({ startEntryDate: value[0], endEntryDate: value[1] })
      }
    }
  ]

  const tableColumns: OfficeProColumns[] = [
    {
      title: 'Account No.',
      dataIndex: 'fromAccountNumber',
      fixed: 'left',
      ...ColumnRender.RenderAccountNo
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueEnum: statusOptions
    },
    { title: 'Expiration Date', dataIndex: 'expirationDate', ...ColumnRender.RenderDayTime },
    {
      title: 'Amount',
      dataIndex: 'amount',
      ...ColumnRender.RenderMoney
    },
    {
      title: 'Request Contracts',
      dataIndex: 'quantity',
      sorter: true,
      ...ColumnRender.RenderNum
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      ...ColumnRender.RenderTZTime
    },
    {
      title: 'Update Time',
      dataIndex: 'updateTime',
      ...ColumnRender.RenderTZTime
    },
    {
      title: 'Action',
      valueType: 'option',
      render: (_, row) => (
        <OfficeAction
          dataSource={[
            /* start_edit */
            {
              url: '', // TODO set permission url
              name: 'Edit',
              onClick: () => handleEditModal(row)
            },
            /* end_edit */
            /* start_detail */
            {
              url: '', // TODO set permission url
              name: 'Detail',
              onClick: () => handleDetailModal(row)
            },
            /* end_detail */
            {
              url: '', // TODO set permission url
              name: 'Submit',
              onClick: () => handleSubmit(row),
              showConfirm: true
            },
            /* start_delete */
            {
              url: '', // TODO set permission url
              name: 'Delete',
              danger: true,
              onClick: () => handleDelete(row)
            }
            /* end_delete */
          ]}
        />
      )
    }
  ]

  return [formColumns, tableColumns]
}
