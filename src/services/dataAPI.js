import apiClient from "./API";

export default {
  getLast(params, signal = null) {
    return apiClient.get('data/last',{ params }, { signal })
  },

  getHistory(params) {
    return apiClient.get('data/history',{ params })
  },

  getAlarmState(params) {
    return apiClient.get('data/last',{ params })
  },

  getAlarmsList(id, locale) {
    return apiClient.get(`device-alarm/${ id }/${ locale }`)
  },

  postControl(device_code,data) {
    return apiClient.post(`device/control/${device_code}`,data)
  },

}