<template>
  <router-view/>
</template>

 <script>
export default {
  name: 'App',
	watch: {
		'$route' (to, from) {
			document.title = to.meta.title || 'Idrolife'
		}
	}
}
</script>

<style>
:root {
  position:relative;
  padding-bottom: 160px;
  margin: 0;
  background: #ADCBF6;
}


#app {
  position:relative;
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  position:relative;
  margin: 0;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
