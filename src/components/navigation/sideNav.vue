<template>
    <div class="nav-wrapper">
      <div class="whatsapp" v-show="noSocial">
        <router-link :to="{name: 'Dashboard'}"><img src="@/assets/whatsapp.png"></router-link>
      </div>
      <div class="apple" v-show="!noSocial">
       <router-link :to="{name: 'Dashboard'}"><img src="@/assets/apple.png"></router-link>
      </div>
      <div class="android" v-show="!noSocial">
       <router-link :to="{name: 'Dashboard'}"><img src="@/assets/android.png"></router-link>
      </div>
      <div class="back" v-show="backOn" @click="goBack">
          <img src="@/assets/Indietro.png" class="cursor-pointer">
      </div>
      <div class="logout" v-show="logout" @click="signOut">
        <router-link :to="{name: 'Dashboard'}"><img src="@/assets/logout.png"></router-link>
      </div>
      <div class="home">
        <router-link :to="{name: 'Dashboard'}"><img src="@/assets/home.png"></router-link>
      </div>
    </div>
</template>

<script>
import router from '@/router'
import { useAuthStore } from '@/stores/AuthStore'

export default {
  props: [
    'backOn', 'noSocial','logout'
  ],
  setup(){
    const authStore = useAuthStore()

    async function signOut() {
      await authStore.signOut()
    }
    const goBack = () => {
      router.go(-1)
    }

    return {
      goBack, signOut
    }
  }
  
}
</script>

<style scoped>

.nav-wrapper {
  @apply 
    fixed z-10 flex flex-col gap-2
    bottom-0 right-[16px]
    pb-[16px]
    transition-all ease-in-out duration-200
}

.nav-wrapper a {
  @apply  items-center justify-center cursor-pointer flex
          
}

.nav-wrapper img {
  @apply 
    w-[40px] h-[40px] 
    sm:w-[60px] sm:h-[60px] 
    md:w-[70px] md:h-[70px] 
    lg:w-[80px] lg:h-[80px] 
    xl:w-[100px] xl:h-[100px]
    2xl:w-[130px] 2xl:h-[130px]
    transition-all ease-in-out duration-200 hover:scale-110
}
</style>
