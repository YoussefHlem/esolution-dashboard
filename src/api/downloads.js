import axiosClient from './axiosClient'

export const downloadsApi = {
  listAll: async () => {
    const response = await axiosClient.get('/downloads')

    return response.data
  },
  get: async downloadId => {
    const response = await axiosClient.get(`/downloads/${downloadId}`)

    return response.data
  },
  create: async download => {
    const response = await axiosClient.post('/downloads', download, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },
  update: async (id, download) => {
    const response = await axiosClient.put(`/downloads/${id}`, download, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },
  delete: async downloadId => {
    const response = await axiosClient.delete(`/downloads/${downloadId}`)

    return response.data
  }
}
