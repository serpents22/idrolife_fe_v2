<template>
  <div class="rilevazioni-container">
    <sidebar :noSocial="true" :backOn="true" />
    <div class="device-container">
      <deviceCard :small=true :content="newData" />
      <div class="xs-icon-card__white">
        <img src="@/assets/ev_report.jpg">
        <p>{{ $t('evReport') }}</p>
      </div>
    </div>
    <div class="dashboard-container">
      <IdroTitle :title="title" />
      <div class="content">
        <div class="header">
          <div class="date-filter">
            <DatePicker @change="dateFiltering()" v-model="startDate" />
            <label>AL</label>
            <DatePicker @change="dateFiltering()" v-model="endDate" />
          </div>
          <div>
            <select class="rounded-lg p-2 cursor-pointer" name="selectedTimeRange" id="selectedTimeRange"
              v-model="selectedTimeRange" @change="renderEvConsumptionChart()">
              <option value="0">Daily</option>
              <option value="1">Weekly</option>
              <option value="2">Monthly</option>
            </select>
          </div>
        </div>
        <div class="table-wrap">
          <div v-if="isLoading" class="flex justify-center bg-white p-6 rounded-md mt-4 w-full">
            <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor" />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill" />
            </svg>
          </div>
          <div v-if="!isLoading && evReportIsEmpty || evReportStatus.isError" class="flex justify-center bg-white p-6 rounded-md mt-4 w-full">
            <h1 v-if="!evReportStatus.isError" class="font-semibold">NO DATA</h1>
            <h1 v-if="evReportStatus.isError" class="font-semibold">{{evReportStatus.message}}</h1>
            
          </div>
          <canvas v-if="!isLoading && !evReportIsEmpty && !evReportStatus.isError" ref="evConsumptionChartCanvas"
            class="bg-white p-6 rounded-md mt-4 w-full"></canvas>
          <div class="button-wrapper">
            <IveButton label="Export CSV" @click="downloadCSV" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDevicesStore } from '@/stores/DevicesStore'
import { useReportStore } from '@/stores/ReportStore'
import { storeToRefs } from 'pinia'
import { defineAsyncComponent, computed, onMounted, onUnmounted, ref } from '@vue/runtime-core'
import DatePicker from '@/components/input/datePicker.vue'
import IveButton from '@/components/input/iveButton.vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave } from 'vue-router'
import { shallowRef } from 'vue'
import { Chart, BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, PointElement, LineElement, LinearScale } from 'chart.js';
Chart.register(zoomPlugin, BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, PointElement, LineElement, LinearScale)
import zoomPlugin from 'chartjs-plugin-zoom'
//chart 
const evConsumptionChartCanvas = ref(null)
let evConsumptionChart
const csvData = ref([])
const renderLoading = ref(false)
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

onBeforeRouteLeave((to, from, next) => {
  // Remove auth when navigating away from this page
  localStorage.removeItem('auth');
  next();
})

function transformData(rawData) {
  const aggregatedData = {};

  rawData.forEach(entry => {
    const date = entry.time;
    if (!aggregatedData[date]) {
      aggregatedData[date] = {};
    }

    entry.data.forEach(stationData => {
      const station = stationData.station;
      const sumLitres = stationData.sumLitres;

      if (!aggregatedData[date][station]) {
        aggregatedData[date][station] = 0;
      }
      aggregatedData[date][station] += sumLitres;
    });
  });

  const labels = Object.keys(aggregatedData);
  const stations = new Set();
  labels.forEach(date => {
    Object.keys(aggregatedData[date]).forEach(station => {
      stations.add(station);
    });
  });

  const datasets = Array.from(stations).map(station => {
    return {
      label: `Station ${station}`,
      backgroundColor: getRandomColor(),
      borderRadius: 2,
      data: labels.map(date => aggregatedData[date][station] || 0)
    };
  });

  return {
    labels,
    datasets
  };
}


async function renderEvConsumptionChart() {
  if (evConsumptionChart) {
    evConsumptionChart.value.destroy();  // Destroy the existing chart instance
  }

  switch (selectedTimeRange.value) {
    case '0':
      if (groupedDataDaily.value.length !== 0) {
        csvData.value = groupedDataDaily.value
        let evConsumptionChartData = transformData(groupedDataDaily.value)
        const evConsumptionChartCtx = evConsumptionChartCanvas.value.getContext('2d')
        evConsumptionChart = shallowRef(new Chart(evConsumptionChartCtx, {
          type: 'bar',
          data: evConsumptionChartData,
          options: {
            plugins: {
              zoom: {
                zoom: {
                  wheel: {
                    enabled: true,
                  },
                  pinch: {
                    enabled: true
                  },
                  drag: {
                    enabled: true
                  },
                  mode: 'x',
                }
              }
            },
            barValueSpacing: 20,
            scales: {
              y: {
                title: {
                  display: true,
                  text: 'Sum of Litres'
                }
              }
            }
          }
        }))
      }
      break;
    case '1':
      if (groupedDataWeekly.value.length !== 0) {
        csvData.value = groupedDataWeekly.value
        let evConsumptionChartData = transformData(groupedDataWeekly.value)
        const evConsumptionChartCtx = evConsumptionChartCanvas.value.getContext('2d')
        evConsumptionChart = shallowRef(new Chart(evConsumptionChartCtx, {
          type: 'bar',
          data: evConsumptionChartData,
          options: {
            barValueSpacing: 20,
            scales: {
              y: {
                title: {
                  display: true,
                  text: 'Sum of Litres'
                }
              }
            }
          }
        }))
      }
      break;
    case '2':
      if (groupedDataMonthly.value.length !== 0) {
        csvData.value = groupedDataMonthly.value
        let evConsumptionChartData = transformData(groupedDataMonthly.value)
        const evConsumptionChartCtx = evConsumptionChartCanvas.value.getContext('2d')
        evConsumptionChart = shallowRef(new Chart(evConsumptionChartCtx, {
          type: 'bar',
          data: evConsumptionChartData,
          options: {
            barValueSpacing: 20,
            scales: {
              y: {
                title: {
                  display: true,
                  text: 'Sum of Litres'
                }
              }
            }
          }
        }))
      }
      break;

    default:
      break;
  }

}


function addData(chart, label, newData) {
  chart.data.labels = []
  chart.data.labels = label;
  chart.data.datasets.forEach((dataset) => {
    dataset.data = []
  });
  chart.data.datasets.forEach((dataset) => {
    newData.forEach((data) => {
      dataset.data.push(data)
    })
  });
  console.log(chart.data.datasets)
  chart.update();
}


function updateEvConsumptionData() {
  addData(topViolationChart.value, topViolation.value.chartData.violation, topViolation.value.chartData.count)
}


const { t } = useI18n()

//props
const props = defineProps({
  id: String
})

//asynchronus component
const deviceCard = defineAsyncComponent(
  () => import('@/components/cards/deviceCard.vue'),
)


//state
const devicesStore = useDevicesStore()
const reportStore = useReportStore()
const { isLoading, groupedDataDaily, groupedDataWeekly, groupedDataMonthly, evReport, evReportIsEmpty, evReportStatus } = storeToRefs(useReportStore())
const title = ref()

//date filter init
let MINIMUM_DIGIT = 2
let date = new Date()
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
let tmpFirstYear = String(firstDay.getFullYear())
let tmpFirstMonth = String((firstDay.getMonth() + 1))
let tmpFirstDay = String(firstDay.getDate())

tmpFirstDay = tmpFirstDay.padStart(MINIMUM_DIGIT, "0")
tmpFirstMonth = tmpFirstMonth.padStart(MINIMUM_DIGIT, "0")

const startDate = ref(String(tmpFirstYear + '-' + tmpFirstMonth + '-' + tmpFirstDay))

let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
let tmpLastYear = String(lastDay.getFullYear())
let tmpLastMonth = String((lastDay.getMonth() + 1))
let tmpLastDay = String(lastDay.getDate())

tmpLastDay = tmpLastDay.padStart(MINIMUM_DIGIT, "0")
tmpLastMonth = tmpLastMonth.padStart(MINIMUM_DIGIT, "0")

const endDate = ref(String(tmpLastYear + '-' + tmpLastMonth + '-' + tmpLastDay))
const fileName = ref(String(startDate.value + '_' + endDate.value) + '_Rilevazoni_Eventi.csv')

//change date format to ISOString
const start = computed(() => {
  let tmpStart = startDate.value.split('-')
  let tmpYear = tmpStart[0]
  let tmpMonth = tmpStart[1]
  let tmpDay = tmpStart[2]
  console.log(tmpStart)
  return new Date(tmpYear, tmpMonth - 1, tmpDay, '00', '00', '00').toISOString()
  // return new Date(Date.UTC(tmpYear, tmpMonth-1, tmpDay, '00', '00', '00')).toISOString()
})
const end = computed(() => {
  let tmpEnd = endDate.value.split('-')
  let tmpYear = tmpEnd[0]
  let tmpMonth = tmpEnd[1]
  let tmpDay = tmpEnd[2]
  console.log(tmpEnd)
  return new Date(tmpYear, tmpMonth - 1, tmpDay, '24', '00', '00').toISOString()
  // return new Date(Date.UTC(tmpYear, tmpMonth-1, tmpDay, '24', '00', '00')).toISOString()
})

const selectedTimeRange = ref('0')

const queryParams = ref({
  device_code: null,
  start_time: null,
  end_time: null
})

async function dateFiltering() {
  renderLoading.value = true
  queryParams.value.start_time = start
  queryParams.value.end_time = end
  fileName.value = String(startDate.value + '_' + endDate.value) + '_EVs_Report.csv'
  await reportStore.loadEvReport(queryParams.value)
  await renderEvConsumptionChart()
  renderLoading.value = true
}

onMounted(async () => {
  await devicesStore.loadDevice(props.id)
  queryParams.value.device_code = devicesStore.deviceData.code
  title.value = 'Idrosat:' + devicesStore.deviceData.name
  dateFiltering()
})

onUnmounted(() => {

})

const newData = computed(() => {
  return [devicesStore.deviceData]
})

async function downloadCSV() {
  await reportStore.downloadEvReport(queryParams.value)
}
</script>

<style scoped>
.rilevazioni-container {
  @apply relative flex flex-col px-[16px] md:px-[200px] lg:px-[260px] xl:px-[320px] 2xl:px-[360px]
}

.dashboard-container {
  @apply flex flex-col w-full justify-center items-center
}

.device-container {
  @apply flex sm:flex-col fixed items-end sm:items-center gap-2 bottom-0 left-4 pb-4 sm:pb-8
}



.content {
  @apply flex flex-col justify-center gap-2 w-full sm:gap-4 sm:my-[20px]
}

.header {
  @apply flex gap-4 flex-col sm:flex-row h-full
}

.table-wrap {
  @apply h-[300px] sm:h-full overflow-auto sm:overflow-visible
}

.search-field {
  @apply relative h-[24px] sm:w-[300px] sm:h-[40px]
}


.date-filter {
  @apply relative items-center flex gap-2 w-full h-[24px] sm:w-[500px] sm:h-[40px]
}

.date-filter label {
  @apply text-[12px] sm:text-[16px] relative text-white
}

.button-wrapper {
  @apply relative h-fit w-full sm:w-[100px] sm:h-[40px] max-w-[80px] sm:max-w-[100px] mt-4
}

.customize-table {
  --easy-table-header-font-size: 10px;
  --easy-table-header-background-color: #DFEAFB;
  --easy-table-row-border: 1px solid #D2DDEE;
  --easy-table-header-height: 30px;

  --easy-table-body-row-background-color: #DFEAFB;
  --easy-table-body-even-row-background-color: #D2DDEE;
  --easy-table-body-row-font-size: 10px;
  --easy-table-body-row-height: 20px;

  --easy-table-footer-font-size: 8px;
  --easy-table-footer-height: 30px;
  --easy-table-footer-background-color: #F5F8FA;
  --easy-table-footer-font-color: #3A3A3E;

}

@media only screen and (min-width: 1536px) {
  .customize-table {
    --easy-table-header-font-size: 16px;
    --easy-table-header-background-color: #DFEAFB;
    --easy-table-header-height: 60px;
    --easy-table-row-border: 2px solid #D2DDEE;

    --easy-table-body-row-background-color: #DFEAFB;
    --easy-table-body-even-row-background-color: #D2DDEE;
    --easy-table-body-row-font-size: 16px;
    --easy-table-body-row-height: 60px;

    --easy-table-footer-font-size: 14px;
    --easy-table-footer-height: 50px;
    --easy-table-footer-background-color: #F5F8FA;
    --easy-table-footer-font-color: #3A3A3E;

  }
}
</style>
