<template>
  <!-- <div class="sidebar-container"> -->
    <div class="nav-wrapper">
      <div class="add" @click="addClick" v-show="!noAdd">
        <img src="@/assets/aggiungiimpianto.png">
      </div>
      <div class="edit" @click="editClick">
        <img src="@/assets/modificaimpianto.png">
      </div>
      <div class="delete" @click="deleteClick">
        <img src="@/assets/eliminaimpianto.png">
      </div>
    </div>
  <!-- </div> -->

</template>

<script>
export default {
  props: [
    'noAdd'
  ],

  setup(props, {emit}) {
    const addClick = () => {
      emit('addClick')
    }
    const editClick = () => {
      emit('editClick')
    }
    const deleteClick = () => {
      emit('deleteClick')
    }

    return {
      addClick, editClick, deleteClick
    }
  } 
  
}
</script>

<style scoped>
.sidebar-container {
  @apply 
    fixed top-0 left-0 h-screen items-center justify-end 
    ml-2 md:ml-4
    flex flex-col 
    transition-all duration-200 ease-in-out
}

.nav-wrapper {
  @apply 
    fixed z-10 flex flex-col gap-2
    bottom-0 left-4
    pb-4 sm:pb-6
}

.nav-wrapper div {
  @apply 
  w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px] lg:w-[80px] lg:h-[80px] xl:w-[110px] xl:h-[110px]
    items-center justify-center flex cursor-pointer
    transition-all ease-in-out duration-200 hover:scale-110

}
</style>