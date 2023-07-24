<template>
  <div class="tab">
    <button v-for="(tab, index) in tabs" :key="tab.value"
        @click="$emit('clicked', tab.value)"
        class="nav"
        :value="index"
        :id="tab.title"
        >{{tab.title}}
      </button>
  </div>
</template>

<script>

export default {
  props:[
    'tabs'
  ],
  setup(props, {emit}) {
    
    function changeTable(event) {
      var subNavs = document.getElementsByClassName("nav")
      for (var i of subNavs) {
        console.log(i)
        i.classList.remove("active");
      }
      event.target.className += " active"
    }
    return {
      changeTable
    }
  }
}
</script>

<style scoped>

.tab {
  @apply flex justify-between w-full gap-4 sm:gap-8 
}
button {
  @apply disabled:opacity-75 flex justify-center items-center relative text-[#1363df] cursor-pointer p-2 rounded-md
    w-[140px] text-[10px] sm:text-[16px]
} 

button:hover {
  @apply bg-[#1363df]/60 text-white  
  transition-colors duration-300 
}

.active {
  @apply bg-[#1363df] text-white  
  transition-colors duration-300 
}




</style>