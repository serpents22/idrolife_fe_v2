import apiClient from "./API";

const config = { 
  headers: {
    Accept: 'application/json'
  }
}

export default {
  signIn(data) {
    return apiClient.post('login',data,config)
  },
  signUp(data) {
    return apiClient.post('register',data,config)
  },
  signOut() {
    return apiClient.get('logout',config)
  },
  deleteAccount(data) {
    return apiClient.post(`user/remove/`,data)
  },
  forgotPassword(data,lang) {
    return apiClient.post(`forgot-password/${lang}`,data)
  },
  newPassword(data,email,signature) {
    return apiClient.post(`reset-password/${email}?signature=${signature}`, data)
  },
  evReportAuth(params) {
    return apiClient.get('password/validate',{params})
  }
}