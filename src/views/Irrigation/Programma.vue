<template>
  <div class="partenze-container">
    <sidebar 
      :noSocial="true" 
      :backOn="true" 
      />
    <div class="device-container">
      <deviceCard 
        :small=true
        :content="newData"
        :id="props.id" />
      <img src="@/assets/programma_partenze.png">
    </div>
    <div class="content">
      <div class="header">
        <IdroTitle title="Programma" />
        <select 
         class="dropdown"
         @change="changeOption($event)">
         <option 
           v-for="tab in tabs" :key="tab.value"
           class="nav"
           :id="tab">{{tab}}</option>
        </select>
        <h2 class="font-bold text-xl">{{title}}</h2>
      </div>
      <div class="main">
        <form @submit.prevent="onSubmit" class="table-container">
          <table>
            <thead>
              <tr>
                <th>
                  <span>Attiva</span>
                </th>
                <th>
                  <span>Orario di inizio</span>
                </th>
                <th>
                  <span>Cicli</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="flex gap-2 items-center">
                    <p>1</p>
                    <input 
                      v-model="satData.isAuto1"
                      type="checkbox" name="auto-1">
                  </div>
                </td>
                <td class="flex gap-4 items-center">
                  <div class="flex gap-2 items-center">
                    <input 
                      v-model="satData.ore0"
                      :disabled="satData.isAuto1 === false"
                      type="number"
                      name="ore0">
                    <span>ore</span>
                  </div>
                  <div class="flex gap-2 items-center">
                    <input 
                      v-model="satData.min0"
                      :disabled="satData.isAuto1 === false"
                      type="number"
                      name="min0">
                    <span>min</span>
                  </div>
                </td>
                <td>
                  <div class="flex gap-2 items-center">
                    <input 
                      v-model="satData.S1"
                      :disabled="satData.isAuto1 === false"
                      type="number"
                      name="cicli0">
                    <span>cicli</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="flex gap-2 items-center">
                    <p>2</p>
                    <input 
                      v-model="satData.isAuto2"
                      type="checkbox" name="auto-2">
                  </div>
                </td>
                <td class="flex gap-4 items-center">
                  <div class="flex gap-2 items-center">
                    <input 
                      v-model="satData.ore2"
                      :disabled="satData.isAuto2 === false"
                      type="number"
                      name="ore2">
                    <span>ore</span>
                  </div>
                  <div class="flex gap-2 items-center">
                    <input 
                      v-model="satData.min2"
                      :disabled="satData.isAuto2 === false"
                      type="number"
                      name="min2">
                    <span>min</span>
                  </div>
                </td>
                <td>
                  <div class="flex gap-2 items-center">
                    <input 
                      v-model="satData.S3"
                      :disabled="satData.isAuto2 === false"
                      type="number"
                      name="cicli3">
                    <span>cicli</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="flex gap-2 items-center">
                    <p>3</p>
                    <input 
                      v-model="satData.isAuto3"
                      type="checkbox" name="auto-3">
                  </div>
                </td>
                <td class="flex gap-4 items-center">
                  <div class="flex gap-2 items-center">
                    <input 
                      v-model="satData.ore4"
                      :disabled="satData.isAuto3 === false"
                      type="number"
                      name="ore4">
                    <span>ore</span>
                  </div>
                  <div class="flex gap-2 items-center">
                    <input 
                      v-model="satData.min4"
                      :disabled="satData.isAuto3 === false"
                      type="number"
                      name="min4">
                    <span>min</span>
                  </div>
                </td>
                <td>
                  <div class="flex gap-2 items-center">
                    <input 
                      v-model="satData.S5"
                      :disabled="satData.isAuto3 === false"
                      type="number"
                      name="cicli5">
                    <span>cicli</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="flex gap-2 items-center">
                    <p>4</p>
                    <input 
                      v-model="satData.isAuto4"
                      type="checkbox" name="auto-4">
                  </div>
                </td>
                <td class="flex gap-4 items-center">
                  <div class="flex gap-2 items-center">
                    <input 
                      v-model="satData.ore6"
                      :disabled="satData.isAuto4 === false"
                      type="number"
                      name="ore6">
                    <span>ore</span>
                  </div>
                  <div class="flex gap-2 items-center">
                    <input 
                      v-model="satData.min6"
                      :disabled="satData.isAuto4 === false"
                      type="number"
                      name="min6">
                    <span>min</span>
                  </div>
                </td>
                <td>
                  <div class="flex gap-2 items-center">
                    <input 
                      v-model="satData.S7"
                      :disabled="satData.isAuto4 === false"
                      type="number"
                      name="cicli7">
                    <span>cicli</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="button-wrapper">
            <MyButton type="submit" class="filled" label="Salva" :loading="postControlIsLoading" />
          </div>
        </form>
      </div>
    </div>
  </div>
  </template>
  
<script setup>
import { useDevicesStore } from '@/stores/DevicesStore'
import { useDataStore } from '@/stores/DataStore'
import { storeToRefs } from 'pinia'
import { defineAsyncComponent,  computed,  onMounted,  ref } from '@vue/runtime-core'
import MyButton from '@/components/button/BaseButton.vue'
  
  //props
  const props = defineProps({
    id: String
  })

  //asynchronus component
  const deviceCard = defineAsyncComponent(
    () => import('@/components/cards/deviceCard.vue'),
  )
  //state
  const deviceStore = useDevicesStore()
  const dataStore = useDataStore()
  const { postControlIsLoading } = storeToRefs(useDataStore())
  const { isLoading } = storeToRefs(useDevicesStore())
  const newData = computed(() => {
      return [deviceStore.deviceData]
    })
  const title = ref()
  const optionValue = ref(1)
  const tabs = ref(['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'])
  const satConfigParams = ref({
    fields: 'S10050,S10051,S10052,S10053,S10054,S10055,S10056,S10057',
    measurement: 'SATPRGSTARTS1',
    device_code: null
  })
  const satData = ref({})
  function fillSatData() {

    let tmpOreMin0 = dataStore.satConfig === undefined ? undefined : dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10050)].split('.')
    let tmpOreMin2 = dataStore.satConfig === undefined ? undefined : dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10052)].split('.')
    let tmpOreMin4 = dataStore.satConfig === undefined ? undefined : dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10054)].split('.')
    let tmpOreMin6 = dataStore.satConfig === undefined ? undefined : dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10056)].split('.')
    satData.value.ore0 = tmpOreMin0 === undefined ? 0 : tmpOreMin0[0]
    satData.value.min0 = tmpOreMin0 === undefined ? 0 : tmpOreMin0[1]
    satData.value.ore2 = tmpOreMin2 === undefined ? 0 : tmpOreMin2[0]
    satData.value.min2 = tmpOreMin2 === undefined ? 0 : tmpOreMin2[1]
    satData.value.ore4 = tmpOreMin4 === undefined ? 0 : tmpOreMin4[0]
    satData.value.min4 = tmpOreMin4 === undefined ? 0 : tmpOreMin4[1]
    satData.value.ore6 = tmpOreMin6 === undefined ? 0 : tmpOreMin6[0]
    satData.value.min6 = tmpOreMin6 === undefined ? 0 : tmpOreMin6[1]

    satData.value.S1 = dataStore.satConfig === undefined ? 0 : dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10051)]
    satData.value.S3 = dataStore.satConfig === undefined ? 0 : dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10053)]
    satData.value.S5 = dataStore.satConfig === undefined ? 0 : dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10055)]
    satData.value.S7 = dataStore.satConfig === undefined ? 0 : dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10057)]
    
    if (satData.value.ore0 != 24 && satData.value.ore0 > 0 || satData.value.min0 > 0 || satData.value.S1 > 0 ) {
      satData.value.isAuto1 = true
    } else if (satData.value.ore0 == 24 && satData.value.min0 == 0 && satData.value.S1 == 0) {
      satData.value.isAuto1 = false
    } else {
      satData.value.isAuto1 = true
    }
     
    if (satData.value.ore2 != 24 && satData.value.ore2 > 0 || satData.value.min2 > 0 || satData.value.S3 > 0 ) {
      satData.value.isAuto2 = true
    } else if (satData.value.ore2 == 24 && satData.value.min2 == 0 && satData.value.S3 == 0) {
      satData.value.isAuto2 = false
    } else {
      satData.value.isAuto2 = true
    }  

    if (satData.value.ore4 != 24 && satData.value.ore4 > 0 || satData.value.min4 > 0 || satData.value.S5 > 0 ) {
      satData.value.isAuto3 = true
    } else if (satData.value.ore4 == 24 && satData.value.min4 == 0 && satData.value.S5 == 0) {
      satData.value.isAuto3 = false
    } else {
      satData.value.isAuto3 = true
    } 

    if (satData.value.ore6 != 24 && satData.value.ore6 > 0 || satData.value.min6 > 0 || satData.value.S7 > 0 ) {
      satData.value.isAuto4 = true
    } else if (satData.value.ore6 == 24 && satData.value.min6 == 0 && satData.value.S7 == 0) {
      satData.value.isAuto4 = false
    } else {
      satData.value.isAuto4 = true
    } 

    console.log(satData.value)
  }
  const postSatConData = ref({
    command: 'SATPRGSTARTS1',
    payload: {}
  })


  onMounted( async () => {
    await deviceStore.loadDevice(props.id)
    satConfigParams.value.device_code = deviceStore.deviceData.code
    title.value = 'Idrosat:' + deviceStore.deviceData.name
    fetchSatData()
  })

  async function changeOption(e) {
    optionValue.value = e.target.value
    console.log(optionValue.value)
    satConfigParams.value.fields = String(
      'S' + (((e.target.value - 1) * 1000) + 10050) + ',' + 
      'S' + (((e.target.value - 1) * 1000) + 10051) + ',' + 
      'S' + (((e.target.value - 1) * 1000) + 10052) + ',' + 
      'S' + (((e.target.value - 1) * 1000) + 10053) + ',' + 
      'S' + (((e.target.value - 1) * 1000) + 10054) + ',' + 
      'S' + (((e.target.value - 1) * 1000) + 10055) + ',' + 
      'S' + (((e.target.value - 1) * 1000) + 10056) + ',' + 
      'S' + (((e.target.value - 1) * 1000) + 10057))

    satConfigParams.value.measurement = String('SATPRGSTARTS' + e.target.value)
    fetchSatData()
    console.log(satData.value)
  }

  async function fetchSatData() {
    await dataStore.getLastSatConfig(satConfigParams.value)
    fillSatData()
  }

  function onSubmit() {
    postSatConData.value.payload = {}
    postSatConData.value.command = String('SATPRGSTARTS' + optionValue.value)

    postSatConData.value.payload['S' + (((optionValue.value - 1) * 1000) + 10050)] = satData.value.isAuto1 === false ? "24.00" : String(satData.value.ore0 + '.' + satData.value.min0)
    postSatConData.value.payload['S' + (((optionValue.value - 1) * 1000) + 10051)] = satData.value.isAuto1 === false ? "0" : String(satData.value.S1)

    postSatConData.value.payload['S' + (((optionValue.value - 1) * 1000) + 10052)] = satData.value.isAuto2 === false ? "24.00" : String(satData.value.ore2 + '.' + satData.value.min2)
    postSatConData.value.payload['S' + (((optionValue.value - 1) * 1000) + 10053)] = satData.value.isAuto2 === false ? "0" : String(satData.value.S3)

    postSatConData.value.payload['S' + (((optionValue.value - 1) * 1000) + 10054)] = satData.value.isAuto3 === false ? "24.00" : String(satData.value.ore4 + '.' + satData.value.min4)
    postSatConData.value.payload['S' + (((optionValue.value - 1) * 1000) + 10055)] = satData.value.isAuto4 === false ? "0" : String(satData.value.S5)

    postSatConData.value.payload['S' + (((optionValue.value - 1) * 1000) + 10056)] = satData.value.isAuto4 === false ? "24.00" : String(satData.value.ore6 + '.' + satData.value.min6) 
    postSatConData.value.payload['S' + (((optionValue.value - 1) * 1000) + 10057)] = satData.value.isAuto4 === false ? "0" : String(satData.value.S7)

    console.log(postSatConData.value.payload)
    dataStore.postControl(satConfigParams.value.device_code,postSatConData.value)
  }

</script>
  
  <style scoped>
  
  .partenze-container {
    @apply 
      relative flex flex-col 
      px-[16px] md:px-[200px] lg:px-[260px] xl:px-[320px] 2xl:px-[360px]
      
  }
  .main {
    @apply flex flex-col w-full justify-center items-center relative
  }
  
  .device-container {
    @apply 
      flex sm:flex-col fixed items-end sm:items-center gap-2
      bottom-0 left-4
      pb-4 sm:pb-8
  }
  
  .device-container img {
    @apply 
      w-[40px] h-[40px] 
      sm:w-[60px] sm:h-[60px]
      md:w-[70px] md:h-[70px]
      lg:w-[80px] lg:h-[80px]
      xl:w-[100px] xl:h-[100px]
      2xl:w-[130px] 2xl:h-[130px]
      transition-all ease-in-out duration-300
  }
  
  .content {
    @apply 
      flex flex-col justify-center
      gap-2
      w-full
      sm:gap-4
      sm:my-[20px] 
  }

.header {
@apply
  flex flex-col justify-center items-center
}
.dropdown {
  @apply pl-2 rounded w-20 sm:w-60 py-2 sm:py-3 cursor-pointer
}

  
  
  input[type=text], input[type=password], input[type=number] {
    @apply pl-2 rounded w-10 md:w-20 py-2
  }
  
  .button-wrapper {
    @apply mt-3 flex w-[100px] mx-auto
  }
  
  
  /* Table Style */
  .table-container {
    @apply 
      w-full
      relative
      h-[300px] sm:h-full
      overflow-auto sm:overflow-visible
  }
  .table-container table {
    @apply 
      mb-10 w-full
  }
  
  
  .table-container th {
    @apply 
      font-semibold py-[10px] px-[10px] text-left sticky top-0 
      border-b-2 border-[#3a3a3e] bg-[#DDE8FA]/60 backdrop-blur-lg z-10
  }
  .table-container td {
    @apply 
      py-[10px] px-[10px]
      bg-[#DDE8FA]/60 backdrop-blur-lg 
  }
  .table-container th,td {
    @apply text-[10px] md:text-[16px]
  }
  
  .table-container tr {
    @apply text-left 
  } 
  </style>