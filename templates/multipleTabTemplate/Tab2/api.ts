import request from '@library/tools/request'

export default {
  list: (data) => {
    return request('/api/pt/bo/cash2Margin/assetTransfer/page', {
      method: 'POST',
      data,
    })
  },
  list2: (data) => {
    return request('/api/pt/bo/funding/wireDeposits/page', {
      method: 'POST',
      data,
    })
  },
  detail: (params: { id: string }) => {
    return request('/api/pt/bo/cash2Margin/assetTransfer/detail', {
      method: 'GET',
      params,
    })
  },
  create: (data) => {
    return request('', {
      method: 'POST',
      data,
    })
  },
  update: (data = {}) => {
    return request('', {
      method: 'POST',
      data,
    })
  },
  delete: (data) => {
    return request('', {
      method: 'POST',
      data,
    })
  },
}
