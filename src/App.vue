<template>
  <router-view/>
</template>

 <script>

import { useLocaleStore } from './stores/localization/LocaleStore'

export default {
  name: 'App',
	watch: {
		'$route' (to, from) {
			document.title = to.meta.title || 'Idrolife'
		}
	},
  setup() {
    const localStore = useLocaleStore()
    return {
      localStore
    }
  },
  methods: {
    mounted() {
      console.log(this.localStore.locale)
      this.$i18n.locale = this.localStore.locale
    }
  },
}
</script>

<style>
:root {
  position:relative;
  padding-bottom: 160px;
  margin: 0;
  background: #ADCBF6;
}

.restrictedAccess {
  @apply invisible
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

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

/* Track */
::-webkit-scrollbar-track {
  background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
