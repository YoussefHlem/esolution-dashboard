import axiosClient from './axiosClient'

export const equipmentsApi = {
  listAll: async () => {
    const response = await axiosClient.get('/equipments')

    return response.data
  },
  get: async equipmentId => {
    const response = await axiosClient.get(`/equipments/${equipmentId}`)

    return response.data
  },
  create: async equipment => {
    const response = await axiosClient.post('/equipments', equipment, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },
  update: async (id, equipment) => {
    const response = await axiosClient.put(`/equipments/${id}`, equipment, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },
  delete: async equipmentId => {
    const response = await axiosClient.delete(`/equipments/${equipmentId}`)

    return response.data
  }
}
