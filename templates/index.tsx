import React, { useEffect, useMemo, useRef } from 'react'
import OfficeProTable from '@library/officeComponents/OfficeProTable'
import { ActionType } from '@ant-design/pro-components'
import { useColumns } from './columns'
import api from './api'
import { useSetState } from 'ahooks'
/* start_edit */
import EditModal from './components/EditModal'
/* end_edit */
/* start_detail */
import DetailModal from './components/DetailModal'
/* end_detail */
import { OfficeButton } from '@library/officeComponents'
import { PlusOutlined } from '@ant-design/icons'
import { SuccessMsg } from '@library/hooks/global'
import { Modal, Space } from 'antd'

export default function Template() {
  const actionRef = useRef<ActionType>()

  const [
    {
      selectedRow,
      /* start_batch */
      selectedRows,
      /* end_batch */
      /* start_detail */
      showDetailModal,
      /* end_detail */
      /* start_edit */
      showEditModal
      /* end_edit */
    },
    setState
  ] = useSetState({
    selectedRow: null,
    /* start_batch */
    selectedRows: [],
    /* end_batch */
    /* start_detail */
    showDetailModal: false,
    /* end_detail */
    /* start_edit */
    showEditModal: false
    /* end_edit */
  })

  /* start_batch */
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
  /* end_batch */

  /* start_edit */
  const handleEditModal = (selectedRow = null) => {
    setState({ showEditModal: true, selectedRow })
  }
  /* end_edit */

  /* start_detail */
  const handleDetailModal = (selectedRow) => {
    setState({ showDetailModal: true, selectedRow })
  }
  /* end_detail */

  const handleSubmit = async (selectedRow) => {
    // TODO do something
    SuccessMsg()
    actionRef.current.reload()
  }

  /* start_delete */
  const handleDelete = async (selectedRow = null) => {
    Modal.confirm({
      content: 'Are you sure to delete?',
      onOk: async () => {
        await api.delete({ ids: [selectedRow?.id] })
        SuccessMsg()
        actionRef.current.reload()
      }
    })
  }
  /* end_delete */

  const [formColumns, tableColumns] = useColumns({
    /* start_edit */
    handleEditModal,
    /* end_edit */
    /* start_detail */
    handleDetailModal,
    /* end_detail */
    /* start_delete */
    handleDelete,
    /* end_delete */
    handleSubmit
  })

  const onClose = (refresh?: boolean) => {
    setState({
      selectedRow: null,
      /* start_detail */
      showDetailModal: false,
      /* end_detail */
      /* start_edit */
      showEditModal: false
      /* end_edit */
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
        /* start_batch */
        rowSelection={rowSelection}
        onDataSourceChange={() => setState({ selectedRows: [] })}
        /* end_batch */
        toolbar={{
          title: (
            <Space align="end" size="middle">
              /* start_edit */
              <OfficeButton
                url="" // TODO set permission url
                onClick={() => handleEditModal()}
                type="primary"
                icon={<PlusOutlined />}
              >
                Add
              </OfficeButton>
              /* end_edit */ /* start_batch */ /* start_delete */
              <OfficeButton
                url="" // TODO set permission url
                type="primary"
                danger
                disabled={!selectedRows.length}
                onClick={handleDelete}
              >
                Batch Delete
              </OfficeButton>
              /* end_delete */ /* end_batch */
            </Space>
          )
        }}
      />
      {/* start_edit */}
      {showEditModal && <EditModal selectedRow={selectedRow} onClose={onClose} />}
      {/* end_edit */}
      {/* start_detail */}
      {showDetailModal && <DetailModal selectedRow={selectedRow} onClose={onClose} />}
      {/* end_detail */}
    </>
  )
}
