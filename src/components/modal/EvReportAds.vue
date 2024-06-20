<template>
  <div>
    <transition name="fade">
      <div class="modal" v-show="isOpen">
        <transition name="drop-in">
          <div class="modal-inner" v-show="isOpen" ref="target">
            <div class="modal-content">
              <h1 class="title">{{ title }}</h1>
              <div class="text-white flex flex-col gap-8">
                <p>{{ $t('evReportAds1') }}</p>
                <p class="text-sm text-left text-[#F2F2F2]">{{ $t('evReportAds2') }}</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  isOpen: Boolean,
  title: String
})

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




</script>

<style scoped>
.title {
  @apply text-left border-b-[1px] pb-[18px] text-[28px] font-normal text-white mb-2 sm:mb-8 text-base sm:text-xl
}


.message-wrapper {
  @apply flex items-center gap-2
}

.form-wrapper {
  @apply flex flex-col gap-6
}


.modal {
  @apply bg-[#ABADAF]/20 backdrop-blur-sm w-full h-full fixed top-0 left-0 px-8 py-10 overflow-x-hidden overflow-y-auto z-40 justify-center items-center flex
}

.modal-inner {
  background: linear-gradient(45.06deg, #010AD1 -8.2%, #1BF728 108.15%);
  @apply rounded-[40px] border-2 border-[#FFEE58] max-w-[500px] w-full h-fit p-10
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
  @apply px-2 py-1 sm:px-3 sm:py-2 rounded-lg border bg-white text-[12px] sm:text-base
}
</style>