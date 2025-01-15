import axiosClient from './axiosClient'

export const newsApi = {
  listAll: async () => {
    const response = await axiosClient.get('/news')

    return response.data
  },
  get: async itemId => {
    const response = await axiosClient.get(`/news/${itemId}`)

    return response.data
  },
  create: async item => {
    const response = await axiosClient.post('/news', item, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },
  update: async (id, item) => {
    const response = await axiosClient.put(`/news/${id}`, item, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },
  delete: async itemId => {
    const response = await axiosClient.delete(`/news/${itemId}`)

    return response.data
  }
}
