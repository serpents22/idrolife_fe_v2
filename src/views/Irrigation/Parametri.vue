<template>
  <div class="parametri-container">
    <sidebar 
      :noSocial="true" 
      :backOn="true" 
      />
    <div class="device-container">
      <deviceCard 
        :small=true
        :content="newData"
        :id="props.id" />
      <img class="w-40" src="@/assets/parametri_generali.png">
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
                  <span>Elemento</span>
                </th>
                <th>
                  <span>Azione</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <label for="nome">Nome Programma</label>
                </td>
                <td>
                  <span class="flex gap-2 items-center">
                    <select disabled  class="dropdown">
                      <option value="2">Soon</option>
                      <option value="0">OFF</option>
                      <option value="1">ON</option>
                    </select>
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <label>Modalita Programma</label>
                </td>
                <td>
                  <span class="flex flex-col gap-1">
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S0 === undefined"
                        id="modalitaProgrammaOn" type="radio" v-model="satData.S0" value="1" name="S0">
                      <label for="modalitaProgrammaOn">OFF</label>
                    </span>
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S0 === undefined"
                        id="modalitaProgrammaOff" type="radio" v-model="satData.S0" value="0" name="S0">
                      <label for="modalitaProgrammaOff">ON</label>
                    </span>
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <label>Programma Minifert Associato</label>
                </td>
                <td>
                  <span>
                    <select :disabled="satData.S19 === undefined" v-model="satData.S19" name="funzionamento-impianto" class="dropdown">
                      <option value="0">OFF</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                    </select>
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <label>Tempo stazione</label>
                </td>
                <td>
                  <span class="flex flex-col gap-1">
                    <span class="flex gap-2">
                      <input
                        @click="changeVolume"
                        :disabled="satData.S1 === undefined"
                        name="tempo"
                        id="tempoStazioneMinuti" type="radio" v-model="satData.S1" value="min">
                      <label for="tempoStazioneMinuti">minuti/secondi</label>
                    </span>
                    <span class="flex gap-2">
                      <input
                        @click="changeVolume"
                        :disabled="satData.S1 === undefined"
                        name="tempo"
                        id="tempoStazioneOre" type="radio" v-model="satData.S1" value="ore">
                      <label for="tempoStazioneOre">ore/minuti</label>
                    </span>
                    <span class="flex gap-2">
                      <input
                        @click="changeTempo"
                        :disabled="satData.S6 === undefined"
                        name="tempo"
                        id="tempoStazioneVolume" type="radio" v-model="satData.S6" value="volume">
                      <label for="tempoStazioneVolume">volume</label>
                    </span>
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <label>Cicli o Finestra Temporale</label>
                </td>
                <td>
                  <span class="flex flex-col gap-1">
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S3 === undefined"
                        name="F3" id="cicliTemporaleCicli" type="radio" 
                        v-model="satData.S3" value="1">
                      <label for="cicliTemporaleCicli">Cicli</label>
                    </span>
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S3 === undefined"
                        name="F3" id="cicliTemporaleTempo" type="radio" 
                        v-model="satData.S3" value="0">
                      <label for="cicliTemporaleTempo">Tempo</label> 
                    </span>
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <label>Ritardo Tra Stazioni</label>
                </td>
                <td>
                  <span class="flex gap-2 items-center">
                    <input
                      :disabled="satData.S12 === undefined"
                      v-model="satData.S12" 
                      type="number" name="F12">
                    <p>sec</p>
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <label>Ritardo Tra Cicli</label>
                </td>
                <td>
                  <span class="flex gap-2 items-center">
                    <input
                      :disabled="satData.S13 === undefined"
                      v-model="satData.S13" 
                      type="number" name="F13">
                    <p>sec</p>
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <label>Modalita Avvio</label>
                </td>
                <td>
                  <span class="flex flex-col gap-1">
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S2 === undefined"
                        id="giorniselezionati" type="radio" v-model="satData.S2" value="0">
                      <label for="giorniselezionati" >giorni selezionati</label>
                    </span>
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S2 === undefined"
                        id="gironisaltati" type="radio" v-model="satData.S2" value="1">
                      <label for="giornisaltati" >giorni saltati</label>
                    </span>
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <label>Prima settimana</label>
                </td>
                <td>
                  <span class="flex flex-col gap-1">
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S18 === undefined || satData.S2 == '1'"
                        id="lunedi" type="checkbox" 
                        v-model="satData.S18" value="1">
                      <label for="lunedi">lunedi</label>
                    </span>
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S18 === undefined || satData.S2 == '1'"
                        id="martedi" type="checkbox" 
                        v-model="satData.S18" value="2">
                      <label for="martedi" >martedi</label>
                    </span>
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S18 === undefined || satData.S2 == '1'"
                        id="mercoledi" type="checkbox" 
                        v-model="satData.S18" value="3">
                      <label for="mercoledi">mercoledi</label>
                    </span>
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S18 === undefined || satData.S2 == '1'"
                        id="giovedi" type="checkbox" 
                        v-model="satData.S18" value="4">
                      <label for="giovedi" >giovedi</label>
                    </span>
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S18 === undefined || satData.S2 == '1'"
                        id="venerdi" type="checkbox" 
                        v-model="satData.S18" value="5">
                      <label for="venerdi" >venerdi</label>
                    </span>
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S18 === undefined || satData.S2 == '1'"
                        id="sabato" type="checkbox" 
                        v-model="satData.S18" value="6">
                      <label for="sabato">sabato</label>
                    </span>
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S18 === undefined || satData.S2 == '1'"
                        id="domenica" type="checkbox" 
                        v-model="satData.S18" value="7">
                      <label for="domenica">domenica</label>
                    </span>
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <label>Seconda settimana</label>
                </td>
                <td>
                  <span class="flex flex-col gap-1">
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S18 === undefined || satData.S2 == '1'"
                        id="lunedi2" type="checkbox" 
                        v-model="satData.S18" value="8">
                      <label for="lunedi2">lunedi</label>
                    </span>
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S18 === undefined || satData.S2 == '1'"
                        id="martedi2" type="checkbox" 
                        v-model="satData.S18" value="9">
                      <label for="martedi2" >martedi</label>
                    </span>
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S18 === undefined || satData.S2 == '1'"
                        id="mercoledi2" type="checkbox" 
                        v-model="satData.S18" value="10">
                      <label for="mercoledi2">mercoledi</label>
                    </span>
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S18 === undefined || satData.S2 == '1'"
                        id="giovedi2" type="checkbox" 
                        v-model="satData.S18" value="11">
                      <label for="giovedi2" >giovedi</label>
                    </span>
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S18 === undefined || satData.S2 == '1'"
                        id="venerdi2" type="checkbox" 
                        v-model="satData.S18" value="12">
                      <label for="venerdi2" >venerdi</label>
                    </span>
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S18 === undefined || satData.S2 == '1'"
                        id="sabato2" type="checkbox" 
                        v-model="satData.S18" value="13">
                      <label for="sabato2">sabato</label>
                    </span>
                    <span class="flex gap-2">
                      <input
                        :disabled="satData.S18 === undefined || satData.S2 == '1'"
                        id="domenica2" type="checkbox" 
                        v-model="satData.S18" value="14">
                      <label for="domenica2">domenica</label>
                    </span>
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <label>Settimana corrente</label>
                </td>
                <td>
                  <span class="flex gap-2 items-center">
                    <p>{{satData.S71}}<sup> o</sup></p>
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <label>Giorni Saltati</label>
                </td>
                <td>
                  <span class="flex gap-2 items-center">
                    <input
                      :disabled="satData.S18A === undefined || satData.S2 == '0'"
                      v-model="satData.S18A" 
                      type="number" name="F18A">
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <label>Giorni Mancanti</label>
                </td>
                <td>
                  <span class="flex gap-2 items-center">
                    <input
                      :disabled="satData.S21 === undefined || satData.S2 == '0'"
                      v-model="satData.S21" 
                      type="number" name="F21">
                  </span>
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
import { functionsIn } from 'lodash';
  
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
  
  const optionValue = ref(1)
  const tabs = ref(['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'])
  const title = ref()
  const satConfigParams = ref({
    fields: 'S10000,S10001,S10002,S10003,S10006,S10012,S10013,S10018,S10019,S10021',
    measurement: 'SATPRGCONFIG1',
    device_code: null
  })
  const satStatParams = ref({
    fields: 'S71',
    measurement: 'SATSTAT',
    device_code: null
  })
  const satData = ref({})

  const decToBinary = ((address) => {
    let number = dataStore.satConfig === undefined ? undefined : parseInt(address)
    let checkBox = ref([])
    if (number === undefined) {
      checkBox.value = undefined
    } else {
      let binary = number.toString(2)
      if (binary.charAt(0) === '1') { checkBox.value.push('1') }
      if (binary.charAt(1) === '1') { checkBox.value.push('2') }
      if (binary.charAt(2) === '1') { checkBox.value.push('3') }
      if (binary.charAt(3) === '1') { checkBox.value.push('4') }
      if (binary.charAt(4) === '1') { checkBox.value.push('5') }
      if (binary.charAt(5) === '1') { checkBox.value.push('6') }
      if (binary.charAt(6) === '1') { checkBox.value.push('7') }
      if (binary.charAt(7) === '1') { checkBox.value.push('8') }
      if (binary.charAt(8) === '1') { checkBox.value.push('9') }
      if (binary.charAt(9) === '1') { checkBox.value.push('10') }
      if (binary.charAt(10) === '1') { checkBox.value.push('11') }
      if (binary.charAt(11) === '1') { checkBox.value.push('12') }
      if (binary.charAt(12) === '1') { checkBox.value.push('13') }
      if (binary.charAt(13) === '1') { checkBox.value.push('14') }
      if (binary.charAt(14) === '1') { checkBox.value.push('15') }
      if (binary.charAt(15) === '1') { checkBox.value.push('16') }
      console.log(checkBox.value)
    }
    return checkBox.value
  })
  function fillSatData() {
    // let number = dataStore.satConfig === undefined ? undefined : parseInt(dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10018)])
    // let checkBox = ref([])
    // if (number === undefined) {
    //   checkBox.value = undefined
    // } else {
    //   let binary = number.toString(2)
    //   if (binary.charAt(0) === '1') { checkBox.value.push('1') }
    //   if (binary.charAt(1) === '1') { checkBox.value.push('2') }
    //   if (binary.charAt(2) === '1') { checkBox.value.push('3') }
    //   if (binary.charAt(3) === '1') { checkBox.value.push('4') }
    //   if (binary.charAt(4) === '1') { checkBox.value.push('5') }
    //   if (binary.charAt(5) === '1') { checkBox.value.push('6') }
    //   if (binary.charAt(6) === '1') { checkBox.value.push('7') }
    //   if (binary.charAt(7) === '1') { checkBox.value.push('8') }
    //   if (binary.charAt(8) === '1') { checkBox.value.push('9') }
    //   if (binary.charAt(9) === '1') { checkBox.value.push('10') }
    //   if (binary.charAt(10) === '1') { checkBox.value.push('11') }
    //   if (binary.charAt(11) === '1') { checkBox.value.push('12') }
    //   if (binary.charAt(12) === '1') { checkBox.value.push('13') }
    //   if (binary.charAt(13) === '1') { checkBox.value.push('14') }
    //   if (binary.charAt(14) === '1') { checkBox.value.push('15') }
    //   if (binary.charAt(15) === '1') { checkBox.value.push('16') }
    //   console.log(checkBox.value)
    // }
    
    

    let tempo = ref()
    let checkBox = ref()
    let saltati = ref()
  
    if (dataStore.satConfig === undefined) {
      tempo.value = undefined
      checkBox.value = undefined
      saltati.value = undefined
    } else {
      let tmpS6 = dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10006)]
      let tmpS1 = dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10001)]
      if (tmpS6 === '0') {
        tempo.value = 'volume'
      } else if (tmpS1 === '0') {
        tempo.value = 'min'
      } else {
        tempo.value = 'ore'
      }
      console.log('not undefined')

      if (dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10002)] == '0'){
        console.log('S2 zero')
        checkBox.value = binToArray(dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10018)])
        saltati.value = '0'
      } else if (dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10002)] == '1') {
        console.log('S2 one')
        saltati.value = dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10018)]
      }

    }
    satData.value.S0 = dataStore.satConfig === undefined ? undefined : dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10000)]
    satData.value.S1 = tempo.value === undefined ? undefined : tempo.value
    satData.value.S2 = dataStore.satConfig === undefined ? undefined : dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10002)]
    satData.value.S3 = dataStore.satConfig === undefined ? undefined : dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10003)]
    satData.value.S6 = tempo.value === undefined ? undefined : tempo.value
    satData.value.S12 = dataStore.satConfig === undefined ? undefined : dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10012)]
    satData.value.S13 = dataStore.satConfig === undefined ? undefined : dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10013)]
    satData.value.S19 = dataStore.satConfig === undefined ? undefined : dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10019)]
    satData.value.S21 = dataStore.satConfig === undefined ? undefined : dataStore.satConfig['S' + (((optionValue.value - 1) * 1000) + 10021)]
    satData.value.S71 = dataStore.satStat === undefined ? undefined : dataStore.satStat.S71
    
    satData.value.S18 = checkBox.value === undefined ? undefined : checkBox.value
    satData.value.S18A = saltati.value === undefined ? undefined : saltati.value

  }

  const postSatConCommand = ref({
    command: 'SATPRGCONFIG1',
    payload: {}
  })
  const postFertConCommand = ref({
    command: 'FERTPRGCONFIG1',
    payload: {}
  })
  const postSatConData = ref({
    command: 'SATPRGCONFIG1',
    payload: {}
  })
  const postSatStatData = ref({
    command: 'SATSTAT',
    payload: {}
  })
  

  onMounted( async () => {
    await deviceStore.loadDevice(props.id)
    satConfigParams.value.device_code = deviceStore.deviceData.code
    satStatParams.value.device_code = deviceStore.deviceData.code
    title.value = 'Idrosat:' + deviceStore.deviceData.name
    await dataStore.getLastSatStat(satStatParams.value)
    await dataStore.getLastSatConfig(satConfigParams.value)
    fillSatData()
  })
  
  function onSubmit() {
    console.log(satData.value)
    postSatConData.value.payload = {}
    postSatConData.value.command = String('SATPRGCONFIG' + optionValue.value)
    postFertConCommand.value.command = String('FERTPRGCONFIG' + satData.value.S19 + '?')
    dataStore.postControl(satStatParams.value.device_code,postFertConCommand.value)

    let tmpBinary = arrayToBinary(satData.value.S18)
    let tmpS6,tmpS1
    if(satData.value.S6 === 'volume') {
      tmpS6 = 0
      tmpS1 = 0
    } else if (satData.value.S1 === 'min') {
      tmpS1 = 0
      tmpS6 = 1
    } else {
      tmpS1 = 1
      tmpS6 = 1
    }

    if (satData.value.S2 == '0') {
      postSatConData.value.payload['S' + (((optionValue.value - 1) * 1000) + 10018)] = String(tmpBinary)
    } else if (satData.value.S2 == '1') {
      postSatConData.value.payload['S' + (((optionValue.value - 1) * 1000) + 10018)] = String(satData.value.S18A)
    }

    postSatConData.value.payload['S' + (((optionValue.value - 1) * 1000) + 10000)] = String(satData.value.S0)
    postSatConData.value.payload['S' + (((optionValue.value - 1) * 1000) + 10001)] = String(tmpS1)
    postSatConData.value.payload['S' + (((optionValue.value - 1) * 1000) + 10002)] = String(satData.value.S2)
    postSatConData.value.payload['S' + (((optionValue.value - 1) * 1000) + 10003)] = String(satData.value.S3)
    postSatConData.value.payload['S' + (((optionValue.value - 1) * 1000) + 10006)] = String(tmpS6)
    postSatConData.value.payload['S' + (((optionValue.value - 1) * 1000) + 10012)] = String(satData.value.S12)
    postSatConData.value.payload['S' + (((optionValue.value - 1) * 1000) + 10013)] = String(satData.value.S13)
    postSatConData.value.payload['S' + (((optionValue.value - 1) * 1000) + 10019)] = String(satData.value.S19)
    postSatConData.value.payload['S' + (((optionValue.value - 1) * 1000) + 10021)] = String(satData.value.S21)
    console.log(postSatConData.value.payload)
    dataStore.postControl(satConfigParams.value.device_code,postSatConData.value)

    postSatStatData.value.payload.S71 = String(satData.value.S71)
    console.log(postSatStatData.value.payload)
    dataStore.postControl(satStatParams.value.device_code,postSatStatData.value)

  }
  function onCancel() {
    dataStore.getLastSatConfig(satConfigParams.value)
  }
  
  async function changeOption(e) {
    optionValue.value = e.target.value
    postSatConCommand.value.command = String('SATPRGCONFIG' + e.target.value + '?')
    dataStore.postControl(satStatParams.value.device_code,postSatConCommand.value)
    console.log(optionValue.value)
    satConfigParams.value.fields = String(
      'S' + (((e.target.value - 1) * 1000) + 10000) + ',' + 
      'S' + (((e.target.value - 1) * 1000) + 10001) + ',' + 
      'S' + (((e.target.value - 1) * 1000) + 10002) + ',' + 
      'S' + (((e.target.value - 1) * 1000) + 10003) + ',' + 
      'S' + (((e.target.value - 1) * 1000) + 10006) + ',' + 
      'S' + (((e.target.value - 1) * 1000) + 10012) + ',' + 
      'S' + (((e.target.value - 1) * 1000) + 10013) + ',' + 
      'S' + (((e.target.value - 1) * 1000) + 10019) + ',' + 
      'S' + (((e.target.value - 1) * 1000) + 10021) + ',' + 
      'S' + (((e.target.value - 1) * 1000) + 10018))

    satConfigParams.value.measurement = String('SATPRGCONFIG' + e.target.value)
    await dataStore.getLastSatConfig(satConfigParams.value)
    await dataStore.getLastSatStat(satStatParams.value)

    fillSatData()
    console.log(satData.value)
  }

  function changeVolume() {
    satData.value.S6 = 'no volume'
  }
  function changeTempo() {
    satData.value.S1 = 'min'
  }

  //other function
  const binToArray = ((address) => {
    let binary = address === undefined ? undefined : address
    console.log(binary)
    let checkBox = ref([])
  if (binary === undefined) {
    checkBox.value = undefined
  } else {
    if (binary.charAt(0) === '1') { checkBox.value.push('1') }
    if (binary.charAt(1) === '1') { checkBox.value.push('2') }
    if (binary.charAt(2) === '1') { checkBox.value.push('3') }
    if (binary.charAt(3) === '1') { checkBox.value.push('4') }
    if (binary.charAt(4) === '1') { checkBox.value.push('5') }
    if (binary.charAt(5) === '1') { checkBox.value.push('6') }
    if (binary.charAt(6) === '1') { checkBox.value.push('7') }
    if (binary.charAt(7) === '1') { checkBox.value.push('8') }
    if (binary.charAt(8) === '1') { checkBox.value.push('9') }
    if (binary.charAt(9) === '1') { checkBox.value.push('10') }
    if (binary.charAt(10) === '1') { checkBox.value.push('11') }
    if (binary.charAt(11) === '1') { checkBox.value.push('12') }
    if (binary.charAt(12) === '1') { checkBox.value.push('13') }
    if (binary.charAt(13) === '1') { checkBox.value.push('14') }
    if (binary.charAt(14) === '1') { checkBox.value.push('15') }
    if (binary.charAt(15) === '1') { checkBox.value.push('16') }
    console.log(checkBox.value)
  }
    return checkBox.value
  })

  const arrayToBinary = ((value) => {
    let tmpArray = value === undefined ? undefined : value
    console.log(tmpArray)
    let tmpBinary =''
    if (tmpArray === undefined) {
      tmpBinary = '000000000000'
    } else {
      tmpBinary = ''
      if (tmpArray.includes('1')) { tmpBinary = tmpBinary.concat('1') } else { tmpBinary = tmpBinary.concat('0') }
      if (tmpArray.includes('2')) { tmpBinary = tmpBinary.concat('1') } else { tmpBinary = tmpBinary.concat('0') }
      if (tmpArray.includes('3')) { tmpBinary = tmpBinary.concat('1') } else { tmpBinary = tmpBinary.concat('0') }
      if (tmpArray.includes('4')) { tmpBinary = tmpBinary.concat('1') } else { tmpBinary = tmpBinary.concat('0') }
      if (tmpArray.includes('5')) { tmpBinary = tmpBinary.concat('1') } else { tmpBinary = tmpBinary.concat('0') }
      if (tmpArray.includes('6')) { tmpBinary = tmpBinary.concat('1') } else { tmpBinary = tmpBinary.concat('0') }
      if (tmpArray.includes('7')) { tmpBinary = tmpBinary.concat('1') } else { tmpBinary = tmpBinary.concat('0') }
      if (tmpArray.includes('8')) { tmpBinary = tmpBinary.concat('1') } else { tmpBinary = tmpBinary.concat('0') }
      if (tmpArray.includes('9')) { tmpBinary = tmpBinary.concat('1') } else { tmpBinary = tmpBinary.concat('0') }
      if (tmpArray.includes('10')) { tmpBinary = tmpBinary.concat('1') } else { tmpBinary = tmpBinary.concat('0') }
      if (tmpArray.includes('11')) { tmpBinary = tmpBinary.concat('1') } else { tmpBinary = tmpBinary.concat('0') }
      if (tmpArray.includes('12')) { tmpBinary = tmpBinary.concat('1') } else { tmpBinary = tmpBinary.concat('0') }
      if (tmpArray.includes('13')) { tmpBinary = tmpBinary.concat('1') } else { tmpBinary = tmpBinary.concat('0') }
      if (tmpArray.includes('14')) { tmpBinary = tmpBinary.concat('1') } else { tmpBinary = tmpBinary.concat('0') }
      if (tmpArray.includes('15')) { tmpBinary = tmpBinary.concat('1') } else { tmpBinary = tmpBinary.concat('0') }
      if (tmpArray.includes('16')) { tmpBinary = tmpBinary.concat('1') } else { tmpBinary = tmpBinary.concat('0') }
    }
    console.log(tmpBinary)
    return tmpBinary
  })
  
</script>
  
<style scoped>

.parametri-container {
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

input[type=text], input[type=password], input[type=number] {
  @apply pl-2 rounded w-20 sm:w-60 py-2 sm:py-3
}
input[type=checkbox], input[type=radio], input[type=range]{
  @apply cursor-pointer
}
input:disabled, select:disabled {
  @apply cursor-default animate-pulse
} 
.dropdown {
  @apply pl-2 rounded w-20 sm:w-60 py-2 sm:py-3 cursor-pointer
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
    border-b border-[#3a3a3e] bg-[#DDE8FA]/60 backdrop-blur-lg z-10
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

.field-wrapper {
  @apply flex py-2 px-4 items-center
}

</style>