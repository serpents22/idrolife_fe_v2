<template>
  <div>
  <alert 
  :message ="status.message"
    :modalActive="modalActive"
    :isError="status.isError"
     @close="closeNotification" />
     <transition name="fade">
       <div class="modal" v-show="isOpen" >
        <transition name="drop-in">
          <div class="modal-inner" v-show="isOpen" ref="target" >
            <div class="modal-content">
            <h1 class="title">{{title}}</h1>
              <div class="select-option flex flex-col gap-1 text-left">
                <label for="master" class="font-bold">Master</label>
                <select name="master" v-model="selectedDevice" class="cursor-pointer bg-transparent">
                  <option v-for="item in supAdmindevices" :key="item.id" :value="item.code">{{ item.name }}</option>
                </select> 
              </div>
              <div class="member-wrapper" >
                <table>
                  <thead>
                    <th>Email</th>
                    <th>Role</th>
                    <th class="text-center">Action</th>
                  </thead>
                  <tbody>
                    <tr v-for="member in members" :key="member.id">
                      <td>
                        <p>{{ member.email }}</p>
                      </td>
                      <td>
                        <p>{{ member.role }}</p>
                      </td>
                      <td>
                        <BaseButton type="submit" class="filled" :label="eliminaLabel" :loading="isLoading"   />
                      </td>
                    </tr>
                  </tbody>
                </table>
<!-- 
                <div class="member-content" v-for="member in members" :key="member.id">
                  <div class="field-wrapper">
                  </div>
                </div> -->
              </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
  </div>
</template>

  
<script setup>
import BaseButton from '@/components/button/BaseButton.vue'
import { useDeviceManagement } from '@/stores/DeviceManagementStore'
import { storeToRefs } from 'pinia'
import { ref, onMounted, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
      isOpen: Boolean,
      title: String
  })

  const modalActive = ref(false)
  const deviceManagementStore = useDeviceManagement()
  const { members, status, isLoading } = storeToRefs(useDeviceManagement())
  const { supAdmindevices } = storeToRefs(useDeviceManagement())
  const cancelLabel = ref('CANCELLA')
  const eliminaLabel = ref('Elimina')
  const regButtonClick = ref(0)
  const cancelButtonClick = ref(0)
  const selectedDevice = ref('')

  
  watch(selectedDevice, async (newValue, oldValue) => {
    if (newValue !== oldValue) {
      await deviceManagementStore.deviceMember(selectedDevice.value)
      console.log(members.value)
    }
  } )


  const onSubmit = async (values, { resetForm }) => {
    let newValues = values
    newValues.role = selectedRole.value
    newValues.device_code = selectedDevice.value
    console.log(newValues)
    regButtonClick.value = ++regButtonClick.value
    if (regButtonClick.value == 1) {
      registerLabel.value = 'the data entered is correct?'
    }

    if (regButtonClick.value == 2) {
      await deviceManagementStore.shareDevice(newValues)
      modalActive.value = true
      if (status.value.isError == true ) {
        setTimeout(closeNotification, 3000)
      } else {
        setTimeout(closeNotification, 3000)
        resetForm()
      }
      registerLabel.value = 'SALVA'
      regButtonClick.value = 0
    }
  }

  const closeNotification = () => {
    modalActive.value = false
  }
  // Define custom events
  const emits = defineEmits(['close'])
  
  const form = ref(null)
  const target = ref(null)

  onClickOutside(target, () => {
    if (props.isOpen) {
      emits('close')
    }
  })

  function cancelForm() {
    cancelButtonClick.value = ++cancelButtonClick.value
    switch (cancelButtonClick.value) {
      case 1:
      cancelLabel.value = 'The entered data will be lost!'
        break;
      case 2:
      form.value.resetForm()
      emits('close')
      cancelButtonClick.value = 0
      cancelLabel.value = 'CANCELLA'
        break;
    }
  }



</script>
  
  <style scoped>

  .member-wrapper table {
    @apply  w-full text-white text-left mt-4 text-[10px] sm:text-base
  }
.member-wrapper thead {
  @apply font-semibold h-16
}
.member-wrapper tr {
  @apply font-medium h-14 justify-center items-center
}

  .title {
    @apply text-left border-b-[1px] pb-[18px] text-[28px] font-normal text-white mb-4 sm:mb-10 text-base sm:text-xl
  }
  

  .message-wrapper {
    @apply flex items-center gap-2
  }
  
  .form-wrapper{
    @apply flex flex-col gap-6
  }

  
  .modal {
  @apply 
    bg-[#ABADAF]/20 backdrop-blur-sm
    w-full h-full
    fixed top-0 left-0 px-8 pt-10 pb-4
    overflow-x-hidden overflow-y-auto z-40
    flex 
}

.modal-inner {
  background: linear-gradient(45.06deg, #010AD1 -8.2%, #1BF728 108.15%);
  @apply 
  rounded-[40px] border-2 border-[#FFEE58] max-w-[800px] w-full h-fit px-4 py-10 sm:p-10 m-auto overflow-x-auto
}

/* .modal-content {
  @apply 
    relative w-[600px] p-[40px] bg-white gap-[30px] rounded-xl
} */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drop-in-enter-active,
.drop-in-leave-active {
  transition: all 0.3s ease-out;
}

.drop-in-enter-from,
.drop-in-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

.select-option {
  @apply  px-2 py-1 sm:px-3 sm:py-2 
          rounded-lg border bg-white
          text-[12px] sm:text-base
} 

  
  </style>