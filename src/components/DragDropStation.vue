<template>
    <div class="card-container">
        <div v-for="(tData, index) in data" :key="index" v-show="tData.length > 0 && tData[0].stazione !== '0'"
            class="card">
            <div class="card-title">
                <p class="stationId">{{ $t('station') }} {{ tData[0].stazione }}</p>
                <p>{{ tData[0].group }}</p>
            </div>

            <div class="card-body py-3">
                <table class="w-full text-xs border-separate border-spacing-2">
                    <thead class="font-semibold">
                        <tr>
                            <th />
                            <th>{{ $t('ev') }}</th>
                            <th>{{ $t('pump') }}</th>
                            <th>{{ $t('master') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in tData" :key="index"
                            class="h-10 hover:h-14 transition-height duration-300 ease-in-out">
                            <td class="itemCell w-10 hover:bg-blue-50 hover:cursor-not-allowed">{{ index + 1 }}</td>
                            <td class="itemCell">{{ getFormattedItemCell(props.solenoidList, item.id) }}</td>
                            <td class="itemCell">{{ getFormattedItemCell(props.pumpList, item.pompa) }}</td>
                            <td class="itemCell">{{ getFormattedItemCell(props.masterList, item.masterv) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from '@vue/reactivity';
import { useDataStore } from '@/stores/DataStore';
import { storeToRefs } from 'pinia'

const props = defineProps({
    id: String,
    solenoidList: null,
    pumpList: null,
    masterList: null,
    masterValue: null,
    pumpValue: null,
    data: null,
    deviceCode: null
})

function getFormattedItemCell(arr, id) {
    let item = props.solenoidList.find(x => x.index == id)
    return item ? `${item.index}: ${item.title}` : 'OFF'
}

</script>

<style scoped>
.card-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

.card {
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

    @apply w-[400px] m-2 p-3 bg-white rounded-lg;
}

.card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e2e8f0;

    @apply font-medium pb-2;
}

.dropdown {
    @apply pl-2 rounded w-20 sm:w-60 py-2 sm:py-3 cursor-pointer
}

.itemCell {
    @apply w-[100px] rounded-sm bg-blue-50 hover:bg-blue-200 cursor-default transition-colors duration-300 ease-in-out hover:cursor-grabbing;
}

.stationId {
    border-radius: 3px;
    @apply text-xs py-1 px-2 bg-gray-200 rounded-sm;
}
</style>