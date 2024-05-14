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
import { Space } from 'antd'

export default function Template() {
  const actionRef = useRef<ActionType>()

  const [{ selectedRow, showDetailModal, showEditModal }, setState] = useSetState({
    showDetailModal: false,
    showEditModal: false,
    selectedRow: null
  })

  const handleEditModal = (selectedRow = null) => {
    setState({ showEditModal: true, selectedRow })
  }
  const handleDetailModal = (selectedRow) => {
    setState({ showDetailModal: true, selectedRow })
  }

  const [formColumns, tableColumns] = useColumns({
    handleEditModal,
    handleDetailModal
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
            </Space>
          )
        }}
      />
      {showEditModal && <EditModal selectedRow={selectedRow} onClose={onClose} />}
      {showDetailModal && <DetailModal selectedRow={selectedRow} onClose={onClose} />}
    </>
  )
}
