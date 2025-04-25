import axiosClient from './axiosClient'

export const blogsApi = {
  listAll: async () => {
    const response = await axiosClient.get('/blogs')

    return response.data
  },
  get: async itemId => {
    const response = await axiosClient.get(`/blogs/${itemId}`)

    return response.data
  },
  create: async item => {
    const response = await axiosClient.post('/blogs', item, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },
  update: async (id, item) => {
    const response = await axiosClient.put(`/blogs/${id}`, item, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },
  delete: async itemId => {
    const response = await axiosClient.delete(`/blogs/${itemId}`)

    return response.data
  }
}
