<template>
  <div :class="{'impiantos' : grid}">
      <div class="impianto" v-for="impianto in content" :key='impianto.id'>
        <div 
          class="modal"
          :class="{'clickable' : clickable, 'small' : small, 'medium':medium}" 
          @click="$emit('clicked', impianto.id)">
          <span class="title">
            {{ impianto.name }} 
          </span>
              <img class="images" src="@/assets/device.png" id="logo">
          <div class="flex flex-col">
            <span class="flex flex-row justify-between mb-1">
              <h2>Stato</h2>
              <Indicator :status="stato" />
            </span>
            <span class="flex flex-row justify-between">
              <h2>ID</h2>
              <p>{{ impianto.code }}</p>
            </span>
            <span class="flex flex-row justify-between">
              <h2>MAC Address</h2>
              <p>{{ impianto.macAddress }}</p>
            </span>
            <span class="flex flex-row justify-between">
              <h2>Version</h2>
              <p>{{ impianto.firmwareVersion }}</p>
            </span>
            <span class="flex flex-row justify-between">
              <h2>Prog. Attivi</h2>
              <p>{{ impianto.prog }}</p>
            </span>
            <span class="flex flex-row justify-between">
              <h2>St. Attive</h2>
              <p>{{ impianto.station }}</p>
            </span>
            <span class="flex flex-row justify-between">
              <h2>Portata</h2>
              <p>{{ impianto.portarta }}</p>
            </span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { useDevicesStore } from '@/stores/DevicesStore'
import Indicator from '@/components/Indicator.vue'
import { storeToRefs } from 'pinia'
import { useDataStore } from '@/stores/DataStore'
import { onMounted, computed, ref } from '@vue/runtime-core'

export default {
  components: {
    Indicator
  },

  data() {
    return {
      stato: false
    }
  },

  props:[
    'content','clickable', 'grid', 'small', 'medium', 'id'
  ],

  async mounted() {
    // console.log(this.content)
    await this.devicesStore.loadDevice(this.id)
    console.log(this.devicesStore.deviceData)
    this.satStatParams.device_code = this.devicesStore.deviceData.code
    await this.dataStore.getLastSatStat(this.satStatParams)
    this.dataInterval = setInterval(async () => {
      this.S8 = this.dataStore.satStat.S8
      await this.dataStore.getLastSatStat(this.satStatParams)
      if (this.S8 === this.dataStore.satStat.S8) {
        this.stato = false
      } else {
        this.stato = true
      }
    }, 5000)
  },

  // getLastData(){
  //   this.dataStore.getLastSatStat(this.satStatParams)
  //   console.log(this.S8, this.dataStore.S8)
  // },

  unmounted() {
    clearInterval(this.dataInterval)
  },

  setup() {
    const devicesStore = useDevicesStore()
    const dataStore = useDataStore()
    const satStatParams = ref({
      fields: 'S8',
      measurement: 'SATSTAT',
      device_code: null
    })
    let dataInterval = null
    let S8

    return {
      devicesStore,
      dataStore,
      satStatParams,
      dataInterval,
      S8
    }
  }
}
</script>

<style scoped>

.modal {
  @apply  
    m-auto bg-white text-left drop-shadow-md flex flex-col box-border text-white 
    transition-transform duration-200 ease-in-out transform
 }

.modal {
  background: linear-gradient(45.06deg, #010AD1 -8.2%, #1BF728 108.15%);
  border: 2px solid #FFEE58;
}

.impiantos {
  @apply 
    flex flex-wrap justify-center gap-8 mx-auto 
    w-[240px] sm:w-[480px] md:w-[900px]
    items-center
    transition-transform duration-200 ease-in-out transform
}

.medium {
  @apply 
    gap-2 md:gap-4
    py-2 px-6 lg:px-8
    w-48 h-60 sm:w-64 sm:h-72 md:w-[300px] md:h-[310px] lg:w-[360px] lg:h-[390px] xl:w-[420px] xl:h-[440px]
    rounded-[40px] md:rounded-[50px] lg:rounded-[60px]
    transition-transform duration-200 ease-in-out transform
}
.small {
  @apply
    flex flex-col justify-between
    px-[10px] py-[6px] 
    sm:px-[20px] sm:py-[8px] 
    md:px-[20px] md:py-[10px]
    xl:px-[30px] xl:py-[10px]
    2xl:px-[40px] 2xl:py-[10px]
    w-[120px] h-[150px]
    sm:w-[150px] sm:h-[190px] 
    md:w-[150px] md:h-[210px] 
    lg:w-[240px] lg:h-[300px] 
    xl:w-[280px] xl:h-[320px]
    2xl:w-[320px] xl:h-[362px]
    rounded-[20px] sm:rounded-[30px] md:rounded-[30px] lg:rounded-[50px] xl:rounded-[60px]
    transition-transform duration-200 ease-in-out transform
}

.small .images {
  @apply
    h-[34px] sm:h-[36px] md:h-[40px] lg:h-[60px] xl:h-[100px] 2xl:h-[120px]
    object-contain
    transition-transform duration-200 ease-in-out transform
}
.small .title {
  @apply 
    text-[10px] sm:text-[14px] md:text-[16px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px]
    transition-transform duration-200 ease-in-out transform
    font-light text-center
}
.small h2 {
  @apply 
    text-[6px] sm:text-[7px] md:text-[7px] lg:text-[12px] xl:text-[14px]
    transition-transform duration-200 ease-in-out transform
    font-semibold
}
.small span p {
  @apply 
    text-[6px] sm:text-[7px] md:text-[7px] lg:text-[12px] xl:text-[14px]
    transition-all duration-200 ease-in-out
    font-normal
}


.medium .images {
  @apply
    h-16 sm:h-24 md:h-[100px] lg:h-36 xl:h-44
    object-contain
    transition-transform duration-200 ease-in-out transform
}

.medium .title {
  @apply 
    text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl
    transition-transform duration-200 ease-in-out transform
    font-light text-center
}
.medium h2 {
  @apply 
    text-[8px] sm:text-xs md:text-xs lg:text-sm xl:text-base
    transition-transform duration-200 ease-in-out transform
    font-semibold
}
.medium span p {
  @apply 
    text-[8px] sm:text-xs md:text-xs lg:text-sm xl:text-base
    transition-all duration-200 ease-in-out
    font-normal
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