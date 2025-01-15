import axiosClient from './axiosClient'

export const projectsApi = {
  listAll: async () => {
    const response = await axiosClient.get('/projects')

    return response.data
  },
  get: async projectId => {
    const response = await axiosClient.get(`/projects/${projectId}`)

    return response.data
  },
  create: async project => {
    const response = await axiosClient.post('/projects', project, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },
  update: async (id, project) => {
    const response = await axiosClient.put(`/projects/${id}`, project, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },
  delete: async projectId => {
    const response = await axiosClient.delete(`/projects/${projectId}`)

    return response.data
  }
}
