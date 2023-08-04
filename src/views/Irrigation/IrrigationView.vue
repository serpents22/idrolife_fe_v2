<template>
  <sidebar 
    :noSocial="true" 
    :backOn="true" 
    />
  <div class="device-container">
    <deviceCard 
      :small="true"
      :content="newData" />
    <img class="w-40" src="@/assets/irrigation.png">
  </div>
  <div class="dashboard-container">
    <IdroTitle :title="title"/>
    <div class="content">
      <div class="sensor">
        <router-link :to="{name: 'IrrigationConfiguration'}"><img src="@/assets/config_irrigazione.png"></router-link>
      </div>
      <div class="irrigation">
        <router-link :to="{name: 'IrrigationSchedule'}"><img src="@/assets/programma_irrigazione.png"></router-link>
      </div>
      <div class="ferrigation">
        <router-link :to="{name: 'IrrigationStatus'}"><img src="@/assets/stato_irrigazione.png"></router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useDevicesStore } from '@/stores/DevicesStore'
  import { storeToRefs } from 'pinia'
  import { defineAsyncComponent,  computed,  onBeforeMount,  ref } from '@vue/runtime-core'

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

  onBeforeMount( async () => {
    await devicesStore.loadDevice(props.id)
    title.value = 'Idrosat:' + devicesStore.deviceData.name
  })


</script>

<style scoped>
.dashboard-container {
  @apply flex flex-col w-full justify-center items-center
}

.device-container {
  @apply 
    flex flex-col fixed items-center gap-2
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
    flex flex-wrap justify-center
    w-[80px] mt-[20px] gap-[20px]
    sm:w-[340px] sm:mt-[60px] 
    md:w-[440px] md:gap-[40px]
    lg:w-[500px] 
    xl:w-[620px] 
    2xl:w-[760px] 2xl:mt-[80px] 2xl:gap-[100px]
    transition-all ease-in-out duration-300

}    

.content img {
  @apply 
    w-[80px] h-[80px]
    sm:w-[100px] sm:h-[100px]
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