

import { defineStore } from 'pinia'
import reportApi from '@/services/reportAPI'
import { ref } from 'vue'

export const useReportStore = defineStore('report', {
  state: () => ({
    evReportIsEmpty: ref(false),
    evReport: ref([]),
    groupedDataDaily: ref([]),
    groupedDataWeekly: ref([]),
    groupedDataMonthly: ref([]),
    reportData: ref([]),
    totalData: ref(),
    isLoading: ref(false),
    status: ref({
      message: null,
      code: null,
    }),
  }),
  actions: {
    async loadReport() {
      this.isLoading = true
      try {
        const res = await reportApi.getReport()
        this.reportData = res.data
        this.totalData = res.data.length
        this.isLoading = false
      } catch (err) {
        console.error(err)
        this.isLoading = false
        return err
      }
    },
    async loadEvReport(params) {
      this.isLoading = true
      try {
        const res = await reportApi.getEvReport(params)
        if (res.data.data.ev.groupedDataDaily.length === 0) {
          this.evReportIsEmpty = true
        } else {
          this.evReportIsEmpty = false
        }
        this.evReport = res.data.data.ev
        this.groupedDataDaily = res.data.data.ev.groupedDataDaily
        this.groupedDataWeekly = res.data.data.ev.groupedDataWeekly
        this.groupedDataMonthly = res.data.data.ev.groupedDataMonthly
        this.isLoading = false
      } catch (err) {
        console.error(err)
        this.isLoading = false
        return err
      }
    },
    async downloadEvReport(params) {
      this.isLoading = true
      try {
        const res = await reportApi.downloadEvReport(params)
        window.open(res.request.responseURL)

        this.isLoading = false
      } catch (err) {
        console.error(err)
        this.isLoading = false
        return err
      }
    },
  }
})