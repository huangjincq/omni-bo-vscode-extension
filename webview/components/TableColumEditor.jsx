import { Input, Typography, Upload, Modal, Tooltip, Progress, message, Button } from 'antd'
import React, { useState, useRef, useEffect } from 'react'
import { CameraOutlined } from '@ant-design/icons'
import Tesseract from 'tesseract.js'

const TableColumEditor = ({ value, onChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [percent, setPercent] = useState(0)

  const workerRef = useRef(null)

  const getText = async (img) => {
    const ret = await workerRef.current.recognize(img)
    const text = ret.data.text.trim() //.replace(/[^A-Za-z\s]/g, '')
    return text
  }

  const handleFileChange = async (info) => {
    const text = await getText(info.file)
    message.success('图片识别成功')
    onChange(text)
    setIsModalOpen(false)
    setPercent(0)
  }

  const handlePaste = (event) => {
    var items = event.clipboardData.items
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        var blob = items[i].getAsFile()
        var reader = new FileReader()
        reader.onload = async function (e) {
          const base64Str = e.target.result
          const text = await getText(base64Str)
          onChange(text)
        }
        reader.readAsDataURL(blob)
      }
    }
  }

  const initTesseract = async () => {
    workerRef.current = await Tesseract.createWorker('eng', Tesseract.OEM.DEFAULT, {
      logger: (m) => {
        switch (m.status) {
          case 'recognizing text': // 解析文字中看进度题
            setPercent(Math.ceil(m.progress * 100))
            break

          default:
            break
        }
      }
    })
  }

  useEffect(() => {
    initTesseract()
    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  return (
    <>
      <div className="table-column-editor">
        <div className="textarea-wrapper">
          <Input.TextArea
            onPaste={handlePaste}
            value={value}
            onChange={onChange}
            className="textarea"
            autoSize={{ minRows: 5, maxRows: 20 }}
            placeholder="可直接粘贴截图或文本"
          />
          {/* <Tooltip title="图片识别" placement="right"> */}
          <Button size="small" type="primary" className="orc-icon" onClick={() => setIsModalOpen(true)}>
            选择图片
          </Button>
          {/* </Tooltip> */}
        </div>
        {percent > 0 && <Progress percent={percent} type="line" format={(percent) => `图像识别进度：${percent}%`} />}
        <Typography.Text type="secondary">用 | 进行分隔为一列, 如: Account Number | Account Type</Typography.Text>
        <Typography.Paragraph type="warning">可直接粘贴截图或文本，图像识别仅支持英文</Typography.Paragraph>
      </div>
      <Modal
        title="根据图片自动识别生成Table列"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        maskClosable={false}
        keyboard={false}
        footer={null}
      >
        <Upload.Dragger
          style={{ marginTop: 10 }}
          customRequest={handleFileChange}
          maxCount={1}
          showUploadList={false}
          disabled={0 < percent && percent < 100}
          accept="image/*"
        >
          <p className="ant-upload-drag-icon">
            <CameraOutlined />
          </p>
          <p className="ant-upload-text">单击或拖动图片到此区域进行识别</p>
          {percent > 0 && <Progress percent={percent} type="line" />}
        </Upload.Dragger>
      </Modal>
    </>
  )
}

export default TableColumEditor
