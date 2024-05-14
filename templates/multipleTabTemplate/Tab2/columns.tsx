import { OfficeProColumns } from '@library/officeComponents/types'
import { ColumnRender } from '@library/tools'
import OfficeAccountSelect from '@library/officeComponents/business/OfficeAccountSelect'
import { useTrSubType } from '@library/hooks/business'

export enum StatusEnum {
  Success = 'SUCCESS',
  Failed = 'FAILED',
  Pending = 'PENDING',
}

export const statusMap = new Map([
  [StatusEnum.Pending, { text: 'Pending', status: 'Processing' }], // status: 'Success' | 'Error' | 'Processing' | 'Warning' | 'Default';
  [StatusEnum.Success, { text: 'Success', status: 'Success' }],
  [StatusEnum.Failed, { text: 'Failed', status: 'Error' }],
])

export function useColumns() {
  const { BOTransactionSubTypeSelect, BOTransactionTypeSelect } = useTrSubType()
  const formColumns: OfficeProColumns[] = [
    {
      title: 'Account No',
      dataIndex: 'accountNumber',
      renderFormItem: () => <OfficeAccountSelect />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueEnum: statusMap,
      search: {
        transform: (value) => {
          if (value) {
            return { statusList: value === StatusEnum.Pending ? [StatusEnum.Pending] : [value] }
          }
        },
      },
    },
    {
      title: 'Transaction Type',
      dataIndex: 'transactionType',
      renderFormItem: (schema, config, form) => (
        <BOTransactionTypeSelect
          onChange={(val) => {
            form.setFieldsValue({ transactionType: val, transactionSubType: undefined })
          }}
        />
      ),
    },
    {
      title: 'Transaction Sub Type',
      dataIndex: 'transactionSubType',
      renderFormItem: () => <BOTransactionSubTypeSelect />,
    },
  ]

  const houseTableColumns: OfficeProColumns[] = [
    {
      title: 'Account No.',
      dataIndex: 'accountNumber',
      fixed: 'left',
      ...ColumnRender.RenderAccountNo,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueEnum: statusMap,
    },
    { title: 'Expiration Date', dataIndex: 'expirationDate', ...ColumnRender.RenderDayTime },
    {
      title: 'Amount',
      dataIndex: 'amount',
      ...ColumnRender.RenderMoney,
    },
  ]

  const streetTableColumns: OfficeProColumns[] = [
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
  ]

  return [formColumns, houseTableColumns, streetTableColumns]
}
