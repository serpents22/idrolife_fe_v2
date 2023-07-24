<template>
  <div class="indicator" 
  :class="status? 'indicator-on' : 'indicator-off'">
  </div>  
</template>

<script>
  export default {
    props:
    [ 'status' ]
  }
</script>



<style scoped>
.indicator {
  @apply w-1 h-1 box-border rounded-full
}
.indicator-off {
  box-shadow: 0px 0px 0px 0px #ED0000, inset 0px 0px 15px #ED0000;
  border: 15px solid #EB5757;
  background:#EB5757
}
.indicator-on {
  box-shadow: 0px 0px 0px 0px #12F07D, inset 0px 0px 7px #12F07D;
  background:#12F07D;
  border: 15px solid #12F07D;
}
@media screen and (max-width: 479px) {
  .indicator-off {
    border: 5px solid #EB5757;
  }
  .indicator-on {
    border: 5px solid #12F07D;
  }
}
@media (min-width: 480px) and (max-width: 767px) {
  .indicator-off {
    border: 10px solid #EB5757;
  }
  .indicator-on {
    border: 10px solid #12F07D;
  }
}
</style>