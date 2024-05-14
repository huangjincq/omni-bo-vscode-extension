import React, { useEffect, useMemo, useRef } from 'react'
import OfficeProTable from '@library/officeComponents/OfficeProTable'
import { ActionType } from '@ant-design/pro-components'
import { useColumns } from './columns'
import api from './api'
import { useSetState } from 'ahooks'
import EditModal from './components/EditModal'
import DetailModal from './components/DetailModal'
import { OfficeButton } from '@library/officeComponents'
import { PlusOutlined } from '@ant-design/icons'
import { SuccessMsg } from '@library/hooks/global'
import { Modal, Space } from 'antd'

export default function Template() {
  const actionRef = useRef<ActionType>()

  const [{ selectedRow, showDetailModal, showEditModal, selectedRows }, setState] = useSetState({
    showDetailModal: false,
    showEditModal: false,
    selectedRow: null,
    selectedRows: []
  })

  const selectedRowKeys = useMemo(() => selectedRows.map((v) => v.id), [selectedRows])

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: string[], selectedRows) => {
      setState({ selectedRows })
    }
    // getCheckboxProps: (record) => ({
    //   disabled: record.status === 1,
    // }),
  }

  const handleEditModal = (selectedRow = null) => {
    setState({ showEditModal: true, selectedRow })
  }
  const handleDetailModal = (selectedRow) => {
    setState({ showDetailModal: true, selectedRow })
  }
  const handleSubmit = async (selectedRow) => {
    // TODO do something
    SuccessMsg()
    actionRef.current.reload()
  }

  const handleDelete = async (selectedRow = null) => {
    Modal.confirm({
      content: 'Are you sure to delete?',
      onOk: async () => {
        await api.delete({ ids: selectedRow ? [selectedRow.id] : selectedRowKeys })
        SuccessMsg()
        actionRef.current.reload()
      }
    })
  }

  const [formColumns, tableColumns] = useColumns({
    handleEditModal,
    handleDetailModal,
    handleDelete,
    handleSubmit
  })

  const onClose = (refresh?: boolean) => {
    setState({
      showDetailModal: false,
      showEditModal: false,
      selectedRow: null
    })
    refresh && actionRef.current.reload()
  }

  return (
    <>
      <OfficeProTable
        actionRef={actionRef}
        formColumns={formColumns}
        tableColumns={tableColumns}
        request={api.list}
        rowSelection={rowSelection}
        onDataSourceChange={() => setState({ selectedRows: [] })}
        toolbar={{
          title: (
            <Space align="end" size="middle">
              <OfficeButton
                url="" // TODO set permission url
                onClick={() => handleEditModal()}
                type="primary"
                icon={<PlusOutlined />}
              >
                Add
              </OfficeButton>
              <OfficeButton
                url="" // TODO set permission url
                type="primary"
                danger
                disabled={!selectedRows.length}
                onClick={handleDelete}
              >
                Batch Delete
              </OfficeButton>
            </Space>
          )
        }}
      />
      {showEditModal && <EditModal selectedRow={selectedRow} onClose={onClose} />}
      {showDetailModal && <DetailModal selectedRow={selectedRow} onClose={onClose} />}
    </>
  )
}
