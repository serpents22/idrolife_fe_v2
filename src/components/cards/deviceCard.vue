<template>
  <div :class="{ 'impiantos': grid }">
    <div class="impianto" v-for="impianto in content" :key='impianto.id'>
      <div class="modal" :class="{ 'clickable': clickable, 'small': small, 'medium': medium }"
        @click="$emit('clicked', impianto.id)">
        <span class="title">
          {{ impianto.name }}
        </span>
        <div class="grid grid-cols-3 items-center w-full">
          <span class="flex flex-col gap-2 items-center">
            <h2>{{ $t('status') }}</h2>
            <Indicator :status="impianto.stato" />
          </span>
          <img class="images" src="@/assets/device.png" id="logo">
          <div class="w-full flex justify-center">
            <img :class="{ 'opacity-0': !impianto.alarm }" class="warning-icon" src="@/assets//icon/warning-icon.png"
              id="logo">
          </div>
        </div>
        <div class="flex flex-col">

          <span class="flex flex-col ">
            <h2>{{ $t('idSerial') }}</h2>
            <p>{{ impianto.code }}</p>
          </span>
          <span class="flex flex-col">
            <h2>Last Heard</h2>
            <p>{{ impianto.device_time }}</p>
          </span>
          <span class="flex flex-row justify-between">
            <h2>{{ $t('systemPressure') }}</h2>
            <p>{{ impianto.systemPressure }}</p>
          </span>
          <span class="flex flex-row justify-between">
            <h2>{{ $t('instantConsumption') }}</h2>
            <p>{{ impianto.consumption }}</p>
          </span>
          <span class="flex flex-row justify-between">
            <h2>{{ $t('flow') }}</h2>
            <p>{{ impianto.portarta }}</p>
          </span>
          <div class="grid grid-cols-2">
            <span class="flex flex-col">
              <h2>{{ $t('activeProg') }}</h2>
              <p>{{ impianto.prog }}</p>
            </span>
            <span class="flex flex-col">
              <h2>{{ $t('activeSt') }}</h2>
              <p>{{ impianto.station }}</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useDevicesStore } from '@/stores/DevicesStore'
import Indicator from '@/components/Indicator.vue'
import { useDataStore } from '@/stores/DataStore'
import { ref } from '@vue/runtime-core'
import axios from 'axios'

export default {
  components: {
    Indicator
  },

  data() {
    return {
      stato: false
    }
  },

  props: [
    'content', 'clickable', 'grid', 'small', 'medium', 'id'
  ],

  async mounted() {
    this.dataInterval = setInterval(async () => {
      this.content.forEach(async (device, index) => {
        this.meteoStatParams.device_code = device.code
        this.meteoController.abort()
        await this.dataStore.getLastMeteoStat(this.meteoStatParams, this.meteoController.signal)
        if (this.dataStore.meteoStat !== undefined) {
          this.content[index].systemPressure = this.dataStore.meteoStat.M33
        } else {
          this.content[index].systemPressure = '-'
        }
      })
    }, 5000)

    this.dataInterval2 = setInterval(async () => {
      this.content.forEach(async (device, index) => {
        this.satStatParams.device_code = device.code

        this.satStatController.abort()

        try {
          await this.dataStore.getLastSatStat(this.satStatParams, this.satStatController.signal)
        } catch (error) {
          if (axios.isCancel(error)) {
            console.log('Request was cancelled');
          } else {
            console.error('Request failed', error);
          }
        }

        if (this.dataStore.satStat !== undefined) {
          let timeNow = new Date(Date.now())
          this.S8 = new Date((this.dataStore.satStat.S8) * 1000)
          let differsTime = Math.floor((timeNow - this.S8) / (1000 * 60))
          this.content[index].device_time = new Date((this.dataStore.satStat.S8) * 1000).toLocaleString()
          if (differsTime > 2) {
            this.content[index].stato = false
          } else {
            this.content[index].stato = true
          }
          if (this.dataStore.satStat.S15 != 0) {
            this.content[index].alarm = true
          } else {
            this.content[index].alarm = false
          }
        } else {
          this.content[index].alarm = false
          this.content[index].stato = false
          this.content[index].device_time = '-'
        }
      })
    }, 5000)

  },


  unmounted() {
    clearInterval(this.dataInterval)
    clearInterval(this.dataInterval2)
  },

  setup() {
    const devicesStore = useDevicesStore()
    const dataStore = useDataStore()
    const satStatParams = ref({
      fields: 'S8,S15',
      measurement: 'SATSTAT',
      device_code: null
    })
    const meteoStatParams = ref({
      fields: 'M33',
      measurement: 'METEOSTAT',
      device_code: null
    })
    let dataInterval = null
    let dataInterval2 = null
    let meteoController = new AbortController()
    let satStatController = new AbortController()
    let S8

    return {
      meteoController,
      satStatController,
      devicesStore,
      dataStore,
      satStatParams,
      dataInterval,
      dataInterval2,
      S8,
      meteoStatParams
    }
  }
}
</script>

<style scoped>
.modal {
  @apply m-auto bg-white text-left drop-shadow-md flex flex-col box-border text-white transition-transform duration-200 ease-in-out transform
}

.modal {
  background: linear-gradient(45.06deg, #010AD1 -8.2%, #1BF728 108.15%);
  border: 2px solid #FFEE58;
}

.impiantos {
  @apply flex flex-wrap justify-center gap-8 mx-auto w-[240px] sm:w-[480px] md:w-[900px] h-fit items-center transition-transform duration-200 ease-in-out transform
}

.medium {
  @apply gap-2 md:gap-4 py-4 px-6 lg:px-8 w-48 sm:w-64 md:w-[300px] lg:w-[360px] xl:w-[420px] rounded-[40px] md:rounded-[50px] lg:rounded-[60px] transition-transform duration-200 ease-in-out transform
}

.small {
  @apply flex flex-col justify-between px-[10px] py-[6px] sm:px-[20px] sm:py-[8px] md:px-[20px] md:py-[10px] xl:px-[30px] xl:py-[10px] 2xl:px-[40px] 2xl:py-[10px] w-[160px] sm:w-[150px] sm:h-[190px] md:w-[150px] md:h-[210px] lg:w-[240px] lg:h-[300px] xl:w-[280px] xl:h-[360px] 2xl:w-[320px] 2xl:h-[380px] rounded-[20px] sm:rounded-[30px] md:rounded-[30px] lg:rounded-[50px] xl:rounded-[60px] transition-transform duration-200 ease-in-out transform
}

.small .images {
  @apply h-[34px] sm:h-[36px] md:h-[40px] lg:h-[60px] xl:h-[100px] 2xl:h-[120px] object-contain transition-transform duration-200 ease-in-out transform
}

.small .warning-icon {
  @apply h-[20px] sm:h-[24px] md:h-[30px] lg:h-[40px] xl:h-[50px] 2xl:h-[60px] object-contain transition-transform duration-200 ease-in-out transform
}

.small .title {
  @apply text-[10px] sm:text-[14px] md:text-[16px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px] transition-transform duration-200 ease-in-out transform font-light text-center
}

.small h2 {
  @apply text-[6px] sm:text-[7px] md:text-[7px] lg:text-[12px] xl:text-[14px] transition-transform duration-200 ease-in-out transform font-semibold
}

.small span p {
  @apply text-[6px] sm:text-[7px] md:text-[7px] lg:text-[12px] xl:text-[14px] transition-all duration-200 ease-in-out font-normal
}


.medium .images {
  @apply h-16 sm:h-24 md:h-[100px] lg:h-36 xl:h-44 object-contain transition-transform duration-200 ease-in-out transform
}

.medium .warning-icon {
  @apply h-[20px] sm:h-[24px] md:h-[30px] lg:h-[40px] xl:h-[50px] 2xl:h-[60px] transition-transform duration-200 ease-in-out transform
}

.medium .title {
  @apply text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl transition-transform duration-200 ease-in-out transform font-light text-center
}

.medium h2 {
  @apply text-[8px] sm:text-xs md:text-xs lg:text-sm xl:text-base transition-transform duration-200 ease-in-out transform font-semibold
}

.medium span p {
  @apply text-[8px] sm:text-xs md:text-xs lg:text-sm xl:text-base transition-all duration-200 ease-in-out font-normal
}


.clickable {
  @apply transition ease-in-out delay-150 cursor-pointer
}

.clickable:hover .title {
  text-shadow: 8px 10px 4px rgba(0, 0, 0, 0.8);
  @apply transition-all ease-in-out delay-150
}

.clickable:hover .images {
  -webkit-filter: drop-shadow(5px 5px 5px #222);
  filter: drop-shadow(5px 5px 5px #222);
  @apply transition-all ease-in-out delay-150
}
</style>