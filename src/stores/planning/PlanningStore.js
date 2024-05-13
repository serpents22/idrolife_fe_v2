import { defineStore } from 'pinia'
import planningAPI from '@/services/planningAPI'
import { ref } from 'vue'

export const usePlanningStore = defineStore('planningStore', {
  state: () => ({
    createPlanStatus: ref({
      message: null,
      isError: false,
      code: null,
    }),
    createPlanLoading: ref(false),
    getPlanningsStatus: ref({
      message: null,
      code: null,
    }),
    getPlanningsLoading: ref(false),
    plannings: ref([]),
    updatePlanningStatus: ref({
      message: null,
      code: null,
    }),
    updatePlanningLoading: ref(false),
    deletePlanningStatus: ref({
      message: null,
      code: null,
    }),
    deletePlanningLoading: ref(false),
    getPlanningStatus: ref({
      message: null,
      code: null,
    }),
    getPlanningLoading: ref(false),
    planning: ref([]),
  }),
  actions: {
    async createPlan(data) {
      this.createPlanLoading = true
      try {
        const res = await planningAPI.createPlan(data)
        console.log(res)
        this.createPlanLoading = false
        this.createPlanStatus.isError = false
        this.createPlanStatus.message = 'Plan Created'
        this.createPlanStatus.code = res.data.status
      } catch (err) {
        console.error(err)
        this.createPlanLoading = false
        this.createPlanStatus.isError = true
        this.createPlanStatus.message = err.response.data.message
        this.createPlanStatus.code = err.response.data.status
        return err
      }
    },
    async getPlannings(params) {
      this.getPlanningsLoading = true
      try {
        const res = await planningAPI.getPlannings(params)
        this.plannings = res.data.data.plannings.map((data) => {
          const startDate = new Date(data.start_at)
          const startYear = startDate.getFullYear();
          const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
          const startDay = String(startDate.getDate()).padStart(2, '0');
          const start = `${startYear}-${startMonth}-${startDay}`;
          // Get the local time components
          const startHours = String(startDate.getHours()).padStart(2, '0');
          const startMinutes = String(startDate.getMinutes()).padStart(2, '0');
          const startSeconds = String(startDate.getSeconds()).padStart(2, '0');
          const startHour = `${startHours}:${startMinutes}:${startSeconds}`;


          const endDate = new Date(data.end_at)
          const endYear = endDate.getFullYear();
          const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
          const endDay = String(endDate.getDate()).padStart(2, '0');
          const end = `${endYear}-${endMonth}-${endDay}`;
          // Get the local time components
          const endHours = String(endDate.getHours()).padStart(2, '0');
          const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
          const endSeconds = String(endDate.getSeconds()).padStart(2, '0');
          const endHour = `${endHours}:${endMinutes}:${endSeconds}`;

          const programName = 'Program ' + data.program_name
          const id = data.id
          return {
            start, end, programName, id, startHour, endHour
          }
        })
        console.log(res.data.data.plannings)
        console.log(this.plannings)
        this.getPlanningsLoading = false
        this.getPlanningsStatus.message = 'Planning Fetched'
        // this.getPlanningsStatus.code = res.data.status
      } catch (err) {
        console.error(err)
        this.getPlanningsLoading = false
        // this.createPlanStatus.message = err.response.data.error
        // this.createPlanStatus.code = err.response.data.status
        return err
      }
    },
    async getPlanning(params) {
      this.getPlanningLoading = true
      try {
        const res = await planningAPI.getPlanning(params)
        console.log(res)

        const startDate = new Date(res.data.data.planning.startAt)
        const startYear = startDate.getFullYear()
        const startMonth = String(startDate.getMonth() + 1).padStart(2, '0')
        const startDay = String(startDate.getDate()).padStart(2, '0')
        const startHours = String(startDate.getHours()).padStart(2, '0')
        const startMinutes = String(startDate.getMinutes()).padStart(2, '0')
        const startSeconds = String(startDate.getSeconds()).padStart(2, '0')

        const endDate = new Date(res.data.data.planning.endAt)
        const endYear = endDate.getFullYear();
        const endMonth = String(endDate.getMonth() + 1).padStart(2, '0')
        const endDay = String(endDate.getDate()).padStart(2, '0')
        const endHours = String(endDate.getHours()).padStart(2, '0')
        const endMinutes = String(endDate.getMinutes()).padStart(2, '0')
        const endSeconds = String(endDate.getSeconds()).padStart(2, '0')

        this.planning.start = `${startYear}-${startMonth}-${startDay}`
        this.planning.startHour = `${startHours}:${startMinutes}:${startSeconds}`
        this.planning.end =`${endYear}-${endMonth}-${endDay}`
        this.planning.endHour =`${endHours}:${endMinutes}:${endSeconds}`
        this.planning.id = res.data.data.planning.id
        this.planning.programName = res.data.data.planning.programName
        this.planning.stations = res.data.data.planning.stations
        console.log(this.planning)
        this.getPlanningLoading = false
        this.getPlanningStatus.message = 'Planning Fetched'
        // this.getPlanningStatus.code = res.data.status
      } catch (err) {
        console.error(err)
        this.getPlanningLoading = false
        // this.createPlanStatus.message = err.response.data.error
        // this.createPlanStatus.code = err.response.data.status
        return err
      }
    },
    async updatePlanning(id, data) {
      this.updatePlanningLoading = true
      try {
        const res = await planningAPI.updatePlanning(id, data)
        console.log(res)
        this.updatePlanningLoading = false
        this.updatePlanningStatus.isError = false
        this.updatePlanningStatus.message = 'Plan Updated'
        this.updatePlanningStatus.code = res.data.status
      } catch (err) {
        console.error(err)
        this.updatePlanningLoading = false
        this.updatePlanningStatus.isError = true
        this.updatePlanningStatus.message = err.response.data.message
        this.updatePlanningStatus.code = err.response.data.status
        return err
      }
    },
    async deletePlanning(id) {
      this.deletePlanningLoading = true
      try {
        const res = await planningAPI.deletePlanning(id)
        console.log(res)
        this.deletePlanningLoading = false
        this.deletePlanningStatus.isError = false
        this.deletePlanningStatus.message = 'Plan Deleted'
        this.deletePlanningStatus.code = res.data.status
      } catch (err) {
        console.error(err)
        this.deletePlanningLoading = false
        this.deletePlanningStatus.isError = true
        this.deletePlanningStatus.message = err.response.data.message
        this.deletePlanningStatus.code = err.response.data.status
        return err
      }
    },
  }

})