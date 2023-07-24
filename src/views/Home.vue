<template>
  <div class="home-container">
    <div class="header">
      <img src="@/assets/logo.png" id="logo">
      <span>
        <h1>Benvenuti nel nuovo portale IdroLife di Idrobit</h1>
      </span>
    </div>
    <div class="menu">
      <router-link :to="{name: 'LoginForm'}"><img src="../assets/Accedi.png"></router-link>
    </div>
      <footer>
        <h2>Idrobit srl - Via Giuseppe Garibaldi, 85, 00012 Villanova di Guidonia - © Idrobit srl 2023</h2>
      </footer>
  </div>

</template>

<script>
export default {
  name: 'Home',
}
</script>

<style scoped>
.home-container {
  @apply flex flex-col
}

.header {
  @apply flex flex-col justify-center mt-10 h-fit w-full items-center gap-3
}

span h1 {
  @apply sm:text-5xl text-xl text-[#353535] font-medium
}

span h2 {
  @apply sm:text-2xl text-xl text-[#353535] font-medium

}
.menu {
  @apply flex flex-col items-center justify-center mt-40
}

.menu img {
  @apply w-64
}
</style>