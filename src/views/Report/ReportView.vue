<template>
  <sidebar 
    :noSocial="true" 
    :backOn="true" 
    />
  <div class="device-container">
    <deviceCard 
      :small=true
      :content="newData" />
    <img class="w-40" src="@/assets/report.png">
  </div>
  <div class="dashboard-container">
    <IdroTitle :title="title"/>
    <div class="content">
      <div class="flex flex-col gap-12">
        <div id="report_allarmi">
          <router-link :to="{name: 'ReportAlarm'}"><img src="@/assets/report_allarmi.png"></router-link>
        </div>
        <div id="report_eventi_programmi">
          <router-link :to="{name: 'ReportEventi'}"><img src="@/assets/report_eventi_programmi.png"></router-link>
        </div>
      </div>
      <div class="flex flex-col gap-12">
        <div id="report_rilevazioni">
          <router-link :to="{name: 'ReportRilevazioni'}"><img src="@/assets/report_rilevazioni.png"></router-link>
        </div>
      </div>
      <div class="flex flex-col gap-12">
        <div id="report_eventi_sensori_umidita">
          <router-link :to="{name: 'ReportUmidita'}"><img src="@/assets/report_eventi_sensori_umidita.png"></router-link>
        </div>
        <div id="report_planning">
          <router-link :to="{name: 'Planning'}"><img src="@/assets/report_planning.png"></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useDevicesStore } from '@/stores/DevicesStore'
  import { storeToRefs } from 'pinia'
  import { defineAsyncComponent,  computed,  onMounted,  ref } from '@vue/runtime-core'

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
  const { isLoading } = storeToRefs(useDevicesStore())
  const newData = computed(() => {
      return [devicesStore.deviceData]
    })

  const title = ref()
  
  onMounted( async () => {
    await devicesStore.loadDevice(props.id)
    title.value = 'Idrosat:' + devicesStore.deviceData.name
  })


</script>

<style scoped>
.dashboard-container {
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
    flex justify-center items-center
    gap-[20px]
    lg:gap-[30px]
    xl:gap-[40px]
    2xl:gap-[80px]
    transition-all ease-in-out duration-300
}


.row {
  @apply
    flex flex-col relative justify-center
    gap-[60px]
    md:gap-[20px]
    lg:gap-[40px]
    xl:gap-[80px]
    transition-all ease-in-out duration-300
}

.content img {
  @apply
    relative
    w-[80px] h-[80px]
    md:w-[120px] md:h-[120px]
    lg:w-[140px] lg:h-[140px]
    xl:w-[180px] xl:h-[180px]
    2xl:w-[200px] 2xl:h-[200px]
    transition-all ease-in-out duration-300
}

span h1 {
  @apply sm:text-3xl text-xl text-[#353535] font-medium
}

span h2 {
  @apply text-xs font-light
}

span p {
  @apply text-base font-normal
}


</style>