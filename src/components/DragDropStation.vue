<template>
    <div class="absolute w-screen">
        <div class="fixed right-0 grid gap-3 font-medium">
            <p class="listButton" @click="showEvList = !showEvList">{{  $t('ev')  }}</p>
            <p class="listButton" @click="showPumpList = !showPumpList">{{  $t('pump')  }}</p>
            <p class="listButton" @click="showMasterList = !showMasterList">{{  $t('evMaster')  }}</p>
        </div>

        <div v-show="showEvList" class="modalListContainer">
            <div class="modalList">

                <div class="modalListHeader">
                    <p>{{  $t('ev')  }}</p>
                    <p @click="showEvList = !showEvList">Close</p>
                </div>

                <div class="modalListBody">
                    <div v-for="(item, index) in props.unassignedEvs" :key="index" class="itemCell justify-self-center">
                        <span>{{ getFormattedItemCell('ev', item.id) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-show="showPumpList" class="modalListContainer">
            <div class="modalList">

                <div class="modalListHeader">
                    <p>{{  $t('pump')  }}</p>
                    <p @click="showPumpList = !showPumpList">Close</p>
                </div>

                <div class="modalListBody">
                    <div v-for="(item, index) in props.pumpList" :key="index" class="itemCell justify-self-center">
                        <span>{{ getFormattedItemCell('pump', item.index) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-show="showMasterList" class="modalListContainer">
            <div class="modalList">

                <div class="modalListHeader">
                    <p>{{  $t('evMaster')  }}</p>
                    <p @click="showMasterList = !showMasterList">Close</p>
                </div>

                <div class="modalListBody">
                    <div v-for="(item, index) in props.masterList" :key="index" class="itemCell justify-self-center">
                        <span>{{ getFormattedItemCell('master', item.index) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="card-container">
        <div v-for="(tData, index) in data" :key="index" v-show="tData.length > 0 && tData[0].stazione != 0"
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
                            <th>{{ $t('evMaster') }}</th>
                        </tr>
                    </thead>
                    <tbody :class="{'cursor-grabbing': draggedCellType != null}">
                        <tr v-for="(item, index) in tData" :key="index" @dragenter.prevent @dragover.prevent>
                            <td class="itemCell w-10 hover:cursor-not-allowed">{{ index + 1 }}</td>
                            <td
                                class="itemCell" 
                                :class="{canDrop: tData[0].stazione > 0 && draggedCellType == 'ev', cannotDrop: tData[0].stazione > 0 && !['ev', null].includes(draggedCellType)}" 
                                :draggable="tData[0].stazione > 0" 
                                @drop="onDrop($event, 'ev', item)"
                                @dragstart="startDrag($event, 'ev', item)" 
                                @dragend="endDrag()">
                                    {{ getFormattedItemCell('ev', item.id) }}
                            </td>
                            <td
                                class="itemCell" 
                                :class="{canDrop: tData[0].stazione > 0 && draggedCellType == 'pump', cannotDrop: tData[0].stazione > 0 && !['pump', null].includes(draggedCellType)}" 
                                :draggable="tData[0].stazione > 0" 
                                @drop="onDrop($event, 'pump', item)"
                                @dragstart="startDrag($event, 'pump', item)" 
                                @dragend="endDrag()">
                                {{ getFormattedItemCell('pump', item.pompa) }}</td>
                            <td
                                class="itemCell" 
                                :class="{canDrop: tData[0].stazione > 0 && draggedCellType == 'master', cannotDrop: tData[0].stazione > 0 && !['master', null].includes(draggedCellType)}" 
                                :draggable="tData[0].stazione > 0" 
                                @drop="onDrop($event, 'master', item)"
                                @dragstart="startDrag($event, 'master', item)" 
                                @dragend="endDrag()">
                            {{ getFormattedItemCell('master', item.masterv) }}</td>
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
    pumpList: null,
    masterList: null,
    masterValue: null,
    pumpValue: null,
    data: null,
    deviceCode: null,
    rawData: null,
    unassignedEvs: null,
})

const draggedCellType = ref(null)
const showEvList = ref(false)
const showPumpList = ref(false)
const showMasterList = ref(false)

function getFormattedItemCell(type, id) {
    // type: ev, pump, master
    
    var item
    switch (type) {
        case 'ev':
            item = props.rawData.find(x => x.id == id)
            return item ? `${item.id}: ${item.ev}` : 'OFF'
            return item
        case 'pump':
            item = props.pumpList.find(x => x.index == id)
            return item ? `${item.index}: ${item.title}` : 'OFF'
        case 'master':
            item = props.masterList.find(x => x.index == id)
            return item ? `${item.index}: ${item.title}` : 'OFF'
        default:
            return 'OFF'
    }
}

function startDrag(event, cellType, item) {
    event.dataTransfer.dropEffect = "move"
    event.dataTransfer.effectAllowed = "move"

    event.dataTransfer.setData("item", JSON.stringify(item))
    event.dataTransfer.setData("cellType", cellType)

    draggedCellType.value = cellType
}

function endDrag() {
    draggedCellType.value = null
}

function onDrop(event, currentCellType, currentItem) {
    let draggedItem = JSON.parse(event.dataTransfer.getData("item"))
    let draggedCellType = event.dataTransfer.getData("cellType")

    if (currentItem.stazione == 0) {
        console.log("current item is disabled", currentItem)
        return
    }

    if (draggedCellType != currentCellType) {
        console.log("dragged and current cell type are different", draggedCellType, currentCellType)
        return
    }

    if (draggedItem.id == currentItem.id) {
        console.log("dragged and current item are the same", draggedItem.id, currentItem.id)
        return
    }

    console.log("old data", props.data)

    // swap the currentItem and draggedItem position in the array and change the stazione of each item to the new props.data stazione accordingly
    let draggedItemIndex = props.data[draggedItem.stazione].findIndex(x => x.id == draggedItem.id)
    let currentItemIndex = props.data[currentItem.stazione].findIndex(x => x.id == currentItem.id)
    
    let tempCurrentItem = props.data[currentItem.stazione][currentItemIndex]

    currentItem = draggedItem
    draggedItem = tempCurrentItem
    tempCurrentItem = currentItem
    
    currentItem.stazione = draggedItem.stazione
    draggedItem.stazione = tempCurrentItem.stazione
 
    props.data[currentItem.stazione][currentItemIndex] = currentItem
    props.data[draggedItem.stazione][draggedItemIndex] = draggedItem

    console.log("new data", props.data)
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

.card.disabled {
    @apply bg-gray-300 opacity-50;
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
    @apply w-[100px] text-xs p-3 justify-center rounded bg-gray-100 cursor-grab transition-colors duration-100 ease-in;
}

.itemCell.canDrop {
    @apply bg-green-300;
}

.itemCell.cannotDrop {
    @apply bg-red-300;
}

.listButton {
    @apply bg-green-400 p-4 rounded-s-lg shadow-lg cursor-pointer hover:bg-green-300 hover:shadow-xl active:bg-red-500 transition-all duration-200 ease-in-out;
}

.stationId {
    border-radius: 3px;
    @apply text-xs py-1 px-2 bg-gray-200 rounded-sm;
}

.modalListContainer {
    @apply fixed right-0 z-10 w-1/5 h-full p-4;
}

.modalList {
    @apply bg-white shadow-lg h-1/2 rounded-2xl py-6 px-4;
}

.modalListHeader {
    @apply flex flex-row justify-between items-center border-b-2 pb-4;
}

.modalListHeader p:first-child {
    @apply font-medium;
}

.modalListHeader p:last-child {
    @apply text-sm cursor-pointer;
}

.modalListBody {
    @apply mt-4 grid grid-cols-2 gap-4 overflow-auto max-h-[85%];
}

.modal {
  background: linear-gradient(45.06deg, #010AD1 -8.2%, #1BF728 108.15%);
  border: 2px solid #FFEE58;
}

</style>