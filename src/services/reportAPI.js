import axios from "axios";
import apiClient from "./API";

export default {
  getReport() {
    return axios.get('http://localhost:3000/gateways')
  },
  getEvReport(params) {
    return apiClient.get(`report/ev-report`, {params} )
  },
  downloadEvReport(params) {
    return apiClient.get(`report/ev-report/export`, {params} )
  }
}