import apiClient from "./API";


export default {
  createPlan(data) {
    return apiClient.post('planning', data)
  },
  getPlannings(params) {
    return apiClient.get('planning', {params})
  },
  updatePlanning(id,data) {
    return apiClient.put(`planning/${id}`, data)
  },
  getPlanning(id) {
    return apiClient.get(`planning/${id}`)
  },
  deletePlanning(id) {
    return apiClient.delete(`planning/${id}`)
  },
  
}