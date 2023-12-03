<template>
    <div class="absolute w-screen">
        <div class="fixed top-[20%] right-0 grid gap-3 font-medium z-10">
            <p class="listButton" @click="showList('ev')">{{  $t('ev')  }}</p>
            <p class="listButton" @click="showList('pump')">{{  $t('pump')  }}</p>
            <p class="listButton" @click="showList('master')">{{  $t('evMaster')  }}</p>
            <p class="listButton bg-blue-500 text-white" @click="saveData()">{{  $t('save')  }}</p>
        </div>

        <div v-show="showEvList" class="modalListContainer">
            <div class="modalList">

                <div class="modalListHeader">
                    <p>{{  $t('ev')  }}</p>
                    <p @click="showEvList = !showEvList">Close</p>
                </div>

                <div 
                    class="modalListBody"
                    :class="{
                        canDrop: draggedCell && draggedStazione != 0 && draggedCellType == 'ev',
                        cannotDrop: draggedCell && draggedStazione != 0 && draggedCellType != 'ev'
                    }" 
                    v-on:dragenter="draggedCell && draggedStazione != 0 && draggedCellType == 'ev' ? $event.preventDefault() : null"
                    v-on:dragover="draggedCell && draggedStazione != 0 && draggedCellType == 'ev' ? $event.preventDefault() : null"
                    @drop="moveCellToList('ev')">
                    <div 
                        v-for="(item, index) in props.unassignedEvs" 
                        :key="index" 
                        class="itemCell"
                        @dragenter.prevent @dragover.prevent
                        :draggable="true" 
                        @dragstart="startDrag($event, 'ev', '0', item.id, item.id, item.ev)" 
                        @dragend="endDrag()">
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

                <div 
                    class="modalListBody"
                    :class="{
                        canDrop: draggedCell && draggedStazione != 0 && draggedCellType == 'pump',
                        cannotDrop: draggedCell && draggedStazione != 0 && draggedCellType != 'pump'
                    }" 
                    v-on:dragenter="draggedCell && draggedStazione != 0 && draggedCellType == 'pump' ? $event.preventDefault() : null"
                    v-on:dragover="draggedCell && draggedStazione != 0 && draggedCellType == 'pump' ? $event.preventDefault() : null"
                    @drop="moveCellToList('pump')">
                    <div 
                        v-for="(item, index) in props.pumpList" 
                        :key="index" 
                        class="itemCell" 
                        @dragenter.prevent @dragover.prevent
                        :draggable="true" 
                        @dragstart="startDrag($event, 'pump', '0', item.index, item.id)" 
                        @dragend="endDrag()">
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

                <div
                    class="modalListBody"
                    :class="{
                        canDrop: draggedCell && draggedStazione != 0 && draggedCellType == 'master',
                        cannotDrop: draggedCell && draggedStazione != 0 && draggedCellType != 'master'
                    }" 
                    v-on:dragenter="draggedCell && draggedStazione != 0 && draggedCellType == 'master' ? $event.preventDefault() : null"
                    v-on:dragover="draggedCell && draggedStazione != 0 && draggedCellType == 'master' ? $event.preventDefault() : null"
                    @drop="moveCellToList('master')">
                    <div                      
                        v-for="(item, index) in props.masterList" 
                        :key="index" 
                        class="itemCell"
                        :draggable="true"
                        @dragstart="startDrag($event, 'master', '0', item.index, item.id)" 
                        @dragend="endDrag()">
                        <span>{{ getFormattedItemCell('master', item.index) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="card-container">
        <div v-for="(tData, index) in data" :key="index" v-show="tData.length > 0 && tData[0].stazione != 0"
            class="card">
            <div class="card-title text-xs">
                <p class="stationId">{{ $t('station') }} {{ tData[0].stazione }}</p>
                <div class="flex flex-row gap-1 justify-center items-center cursor-pointer" v-if="selectedGroupItem?.stazione != tData[0].stazione" @click="editName(tData[0])">
                    <p>{{ tData[0].group }}</p>
                    <img src="@/assets/material_edit.png" id="editName" class="w-4 h-4">
                </div>
                <div v-if="selectedGroupItem?.stazione == tData[0].stazione" class="flex flex-row gap-1 justify-center items-center">
                    <input type="text" class="border p-1 text-xs" v-model="tData[0].group">
                    <IveButton @click="saveName(tData)" class="filled__blue !text-xs h-[24px]" :label="$t('save')" :loading="postControlIsLoading"/>
                </div>
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
                        <tr v-for="(item, index) in tData" :key="index">
                            <td class="itemCell w-10 hover:cursor-not-allowed">{{ index + 1 }}</td>
                            <td
                                class="itemCell" 
                                :class="{canDrop: tData[0].stazione > 0 && draggedCellType == 'ev', cannotDrop: tData[0].stazione > 0 && !['ev', undefined].includes(draggedCellType)}" 
                                :draggable="tData[0].stazione > 0" 
                                v-on:dragenter="draggedCellType == 'ev' ? $event.preventDefault() : null"
                                v-on:dragover="draggedCellType == 'ev' ? $event.preventDefault() : null"
                                @drop="onDrop('ev', item.stazione, item)"
                                @dragstart="startDrag($event, 'ev', item.stazione, item.id, item.id)" 
                                @dragend="endDrag()">
                                    {{ getFormattedItemCell('ev', item.id) }}
                            </td>
                            <td
                                class="itemCell" 
                                :class="{canDrop: tData[0].stazione > 0 && draggedCellType == 'pump', cannotDrop: tData[0].stazione > 0 && !['pump', undefined].includes(draggedCellType)}" 
                                :draggable="tData[0].stazione > 0" 
                                v-on:dragenter="draggedCellType == 'pump' ? $event.preventDefault() : null"
                                v-on:dragover="draggedCellType == 'pump' ? $event.preventDefault() : null"
                                @drop="onDrop('pump', item.stazione, item)"
                                @dragstart="startDrag($event, 'pump', item.stazione, item.pompa, item.id)" 
                                @dragend="endDrag()">
                                {{ getFormattedItemCell('pump', item.pompa) }}</td>
                            <td
                                class="itemCell" 
                                :class="{canDrop: tData[0].stazione > 0 && draggedCellType == 'master', cannotDrop: tData[0].stazione > 0 && !['master', undefined].includes(draggedCellType)}" 
                                :draggable="tData[0].stazione > 0" 
                                v-on:dragenter="draggedCellType == 'master' ? $event.preventDefault() : null"
                                v-on:dragover="draggedCellType == 'master' ? $event.preventDefault() : null"
                                @drop="onDrop('master', item.stazione, item)"
                                @dragstart="startDrag($event, 'master', item.stazione, item.masterv, item.id)" 
                                @dragend="endDrag()">
                            {{ getFormattedItemCell('master', item.masterv) }}</td>
                        </tr>

                        <!-- empty row placeholder for index and ev cell -->
                        <tr
                            @dragenter.prevent @dragover.prevent
                            @drop="addRowToExistingGroup(tData[0].stazione, tData[0].group, draggedCell.id)"
                            :class="{
                                    'invisible': !draggedCell || draggedCellType != 'ev' || draggedStazione == tData[0].stazione
                                }" >
                            <td 
                                class="itemCell w-10 hover:cursor-not-allowed transition-height duration-200 ease-in-out"
                                :class="{
                                    '!h-0': !draggedCell || draggedCellType != 'ev' || draggedStazione == tData[0].stazione
                                }" />
                            <td 
                                class="itemCell transition-height duration-200 ease-in-out canDrop" 
                                :class="{
                                    '!h-0': !draggedCell || draggedCellType != 'ev' || draggedStazione == tData[0].stazione
                                }" />
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from '@vue/reactivity';
import IveButton from '@/components/button/BaseButton.vue';
import { useDataStore } from '@/stores/DataStore';
import { storeToRefs } from 'pinia'
import { computed } from 'vue';

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

const dataStore = useDataStore()
const { postControlIsLoading } = storeToRefs(useDataStore())

const showEvList = ref(false)
const showPumpList = ref(false)
const showMasterList = ref(false)

const isEditingName = ref(false)
const selectedGroupItem = ref(null)

const draggedCell = ref(null)
const draggedCellType = computed(() => draggedCell.value?.cellType)
const draggedStazione = computed(() => draggedCell.value?.stazione)
const openedListProgrammaticaly = ref(false)

const postData = ref({
    command: 'EVCONFIG',
    payload: {}
})

const postGroupData = ref({
    command: 'GROUPCONFIG',
    payload: {}
})

function editName(tDataItem) {
    isEditingName.value = true
    selectedGroupItem.value = tDataItem
}

function saveName(tData) {
    postGroupData.value.payload = {}
    var stationId = Number(tData[0].stazione)
    var groupName = String(tData[0].group)

    setGroupName(stationId, groupName, tData)

    postGroupData.value.payload['S' + Number(6000 + stationId - 1)] = groupName
    dataStore.postControl(props.deviceCode, postGroupData.value)

    if (isEditingName.value) {
        isEditingName.value = false
        selectedGroupItem.value = null
    }
}

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

function showList(listType) {
    switch (listType) {
        case 'ev':
            showEvList.value = true
            showPumpList.value = false
            showMasterList.value = false
            break;
        case 'pump':
            showEvList.value = false
            showPumpList.value = true
            showMasterList.value = false
            break;
        case 'master':
            showEvList.value = false
            showPumpList.value = false
            showMasterList.value = true
            break;
        default:
            break;
    }
}

function setGroupName(stationId, groupName, groupData){      
    for(var i=0; i < groupData.length; i++){
        groupData[i].group = groupName
        groupData[i].stazione = stationId
    }
   
    return;
}

function startDrag(event, cellType, stazione, id, rowId, serial) {
    event.dataTransfer.dropEffect = "move"
    event.dataTransfer.effectAllowed = "move"

    switch (cellType) {
        case 'ev':
            if (!showEvList.value) { // list not opened yet
                showList('ev')
                openedListProgrammaticaly.value = true
            }
            break;
        case 'pump':
            if (!showPumpList.value) {
                showList('pump')
                openedListProgrammaticaly.value = true
            }
            break;
        case 'master':
            if (!showMasterList.value) {
                showList('master')
                openedListProgrammaticaly.value = true
            }
            break;
        default:
            break;
    }

    draggedCell.value = { id, rowId, stazione, cellType, serial }
}

function endDrag() {
    draggedCell.value = null

    // if list is opened programmaticaly, close it after certain delay
    if (openedListProgrammaticaly.value) {
        openedListProgrammaticaly.value = false

        setTimeout(() => {
            showEvList.value = false
            showPumpList.value = false
            showMasterList.value = false
        }, 300)
    }
}

function onDrop(currentCellType, currentStazione, currentItem) {

    let draggedId = draggedCell.value.id
    let draggedCellType = draggedCell.value.cellType
    let draggedStazione = draggedCell.value.stazione
    let draggedRowId = draggedCell.value.rowId

    if (currentStazione == 0) {
        return
    }

    if (draggedCellType != currentCellType) {
        return
    }

    let currentId // id by cellType
    let cellKey
    switch (currentCellType) {
        case 'ev':
           cellKey = 'id'
            break;
        case 'pump':
            cellKey = 'pompa'
            break;
        case 'master':
            cellKey = 'masterv'
            break;
        default:
            break;
    }

    currentId = currentItem[cellKey]

    if (draggedId == currentId ) {
        return
    }

    let fromList = draggedStazione == 0
    let fromPumpList = fromList && draggedCellType == 'pump'
    let fromMasterList = fromList && draggedCellType == 'master'
    let isEvCell = currentCellType == 'ev'

    let tempCurrentItem = { ...currentItem }
    let draggedItem = props.rawData.find(x => x.id == draggedRowId)
    
    // set current cell ev value to dragged item ev value
    if (isEvCell) {
        currentItem.ev = draggedItem.ev
    } else { // set id if not ev cell
        currentItem[cellKey] = draggedId
    }
    
    // set dragged cell value to current item value
    if (!fromPumpList && !fromMasterList) {
        if (isEvCell) {
            draggedItem.ev = tempCurrentItem.ev
        } else {
            draggedItem[cellKey] = tempCurrentItem[cellKey]
        }
    }
}

function moveCellToList(currentCellType) {
    let draggedCellType = draggedCell.value.cellType
    let draggedStazione = draggedCell.value.stazione
    let draggedRowId = draggedCell.value.rowId

    // cancel if moving from list to list
    if (draggedStazione == 0) {
        return
    }

    if (draggedCellType != currentCellType) {
        return
    }

    let draggedItem = props.rawData.find(x => x.id == draggedRowId)
    let isEvCell = currentCellType == 'ev'

    let cellKey
    switch (currentCellType) {
        case 'ev':
           cellKey = 'id'
            break;
        case 'pump':
            cellKey = 'pompa'
            break;
        case 'master':
            cellKey = 'masterv'
            break;
        default:
            break;
    }

    if (isEvCell) { // remove row from group
        draggedItem.stazione = 0
    } else {
        draggedItem[cellKey] = 0
    }
}

// id is used to calculate the address of the new row
function addRowToExistingGroup(stationId, group, id) {
    const item = props.rawData.find(x => x.id == id)
    item.stazione = stationId
    item.group = group
}

function saveData() {
    postData.value.payload = {}
    props.rawData.forEach((valve) => {
        let localId = valve.id == 0 ? 1 : valve.id
        let localStation = Number(valve.stazione) ?? 0


        // set new data
        postData.value.payload['S' + (2000 + ((localId - 1) * 6))] = valve.ev
        postData.value.payload['S' + (2002 + ((localId - 1) * 6))] = localStation
        postData.value.payload['S' + (2003 + ((localId - 1) * 6))] = valve.pompa
        postData.value.payload['S' + (2004 + ((localId - 1) * 6))] = valve.masterv
        // postData.value.payload['S' + (2005 + ((localId - 1) * 6))] = 0
    })

    dataStore.postControl(props.deviceCode, postData.value)
}

</script>

<style scoped>
.card-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

.card {
    @apply w-[400px] m-2 p-3 bg-white rounded-lg shadow-lg;
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
    @apply w-[100px] h-[40px] text-center text-xs justify-center rounded bg-gray-100 cursor-grab transition-colors duration-100 ease-in;
}

.itemCell > span {
    @apply flex flex-col justify-center items-center h-full;
}

.canDrop {
    @apply bg-green-300;
}

.cannotDrop {
    @apply bg-red-300;
}

.listButton {
    @apply bg-green-400 p-4 rounded-s-lg shadow-lg cursor-pointer hover:bg-green-300 hover:shadow-xl transition-all duration-200 ease-in-out;
}

.stationId {
    border-radius: 3px;
    @apply text-xs py-1 px-2 bg-gray-200 rounded-sm;
}

.modalListContainer {
    @apply fixed right-0 z-10 w-1/5 h-full p-4;
}

.modalList {
    @apply bg-white shadow-lg h-1/2 rounded-2xl py-6 px-4
    flex flex-col;
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
    @apply p-2 mt-2 grid grid-cols-2 auto-rows-min gap-x-1 gap-y-3 overflow-auto max-h-[85%] transition-all duration-200 ease-in-out
    flex-grow;
}

.modalListBody .itemCell {
    @apply justify-self-center;
}

.modal {
  background: linear-gradient(45.06deg, #010AD1 -8.2%, #1BF728 108.15%);
  border: 2px solid #FFEE58;
}

.hidden .itemCell {
    @apply !h-0;
}

</style>