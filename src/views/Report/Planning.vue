<template>
	<div id="app">
		<h1>My Calendar</h1>
		<!-- <calendar-view
			:show-date="showDate"
			class="theme-default">

		</calendar-view> -->
	</div>
</template>
<script>
	// import { CalendarView } from "vue-simple-calendar"


	export default {
		name: 'app',
		data: function() {
			return { showDate: new Date() }
		},
		components: {
			// CalendarView,
		},
		methods: {
			setShowDate(d) {
				this.showDate = d;
			},
		}
	}
</script>
<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		color: #2c3e50;
		height: 67vh;
		width: 90vw;
		margin-left: auto;
		margin-right: auto;
	}
</style>