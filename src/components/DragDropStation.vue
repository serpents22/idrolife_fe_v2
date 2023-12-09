<template>
    <alert 
    :message ="modalMessage"
    :modalActive="modalActive"
    :isError="isError"
     @close="closeNotification" />

    <div class="absolute w-screen">
        <div class="fixed top-[20%] right-0 hidden md:grid gap-3 font-medium z-10">
            <p class="listButton" @click="showList('ev')">{{  $t('ev')  }}</p>
            <p class="listButton" @click="showList('pump')">{{  $t('pump')  }}</p>
            <p class="listButton" @click="showList('master')">{{  $t('evMaster')  }}</p>
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
                        :draggable="isEditing" 
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
                        :draggable="isEditing" 
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
                        :draggable="isEditing"
                        @dragstart="startDrag($event, 'master', '0', item.index, item.id)" 
                        @dragend="endDrag()">
                        <span>{{ getFormattedItemCell('master', item.index) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="space-y-4 h-[50vh] md:h-full">

        <!-- header row, edit button -->
        <div class="flex flex-col gap-4 lg:flex-row space-x-4 justify-between">
            <div class="bg-white flex flex-row justify-between items-center space-x-4 rounded px-4 py-2 w-full">
                <h2 class="text-sm">{{ $t('stationsManagement') }}</h2>

                <IveButton v-if="!isEditing" @click="isEditing = !isEditing" class="filled__blue w-fit text-xs" :label="$t('edit')" :loading="isLoading" />
                <div v-else class="flex flex-row space-x-2">
                    <IveButton @click="shouldReset ? reset() : confirmReset()" class="filled w-fit text-xs" :label="$t(shouldReset ? 'dataLost' : 'cancel')" :loading="isLoading" />
                    <IveButton @click="saveData()" class="filled__blue w-fit text-xs" :label="$t('save')" :loading="isLoading" />
                </div>
            </div>

            <div v-if="isEditing" class="flex flex-row justify-center items-center space-x-4">
                <select class="dropdown text-xs" v-model="selectedGroup">
                    <option value="" disabled>{{ $t('group') }}</option>
                    <option v-for="({ address, title }) in props.availableGroup" :value="address">{{ title }}</option>
                </select>

                <IveButton @click="addGroup()" class="filled__blue text-xs w-fit py-3" :label="$t('addGroup')" :loading="isLoading" />
            </div>
            <!-- <div v-else /> -->
        </div>

        <div class="card-container h-5/6 overflow-auto">
            <div v-for="(group, index) in props.newGroups" :key="index" v-if="isEditing" class="card">
                <div class="card-title text-xs">
                    <p class="stationId">{{ $t('station') }} {{ group.stazione }}</p>
                    <div class="flex flex-row gap-1 justify-center items-center cursor-pointer" v-if="editedNameStation != group.stazione" @click="editName(group.stazione)">
                        <p>{{ group.title }}</p>
                        <img src="@/assets/material_edit.png" id="editName" class="w-4 h-4">
                    </div>
                    <div v-if="editedNameStation == group.stazione" class="flex flex-row gap-1 justify-center items-center">
                        <input type="text" class="border p-1 text-xs" v-model="group.title">
                        <IveButton @click="saveName(group.stazione, group.title)" class="filled__blue !text-xs h-[24px]" :label="$t('save')" :loading="postControlIsLoading"/>
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
                        <tbody>
                            <!-- empty row placeholder for index and ev cell -->
                            <tr
                                @dragenter.prevent @dragover.prevent
                                @drop="addRowToNewGroup(group, draggedCell.id)"
                                :class="{
                                        'invisible': !draggedCell || draggedCellType != 'ev' || draggedStazione == group.stazione
                                    }" >
                                <td 
                                    class="itemCell w-10 hover:cursor-not-allowed transition-height duration-200 ease-in-out"
                                    :class="{
                                        '!h-0': !draggedCell || draggedCellType != 'ev' || draggedStazione == group.stazione
                                    }" />
                                <td 
                                    class="itemCell transition-height duration-200 ease-in-out canDrop" 
                                    :class="{
                                        '!h-0': !draggedCell || draggedCellType != 'ev' || draggedStazione == group.stazione
                                    }" />
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- view for mobile -->
            <div v-for="(tData, index) in data" 
                :key="index"
                v-show="tData.length > 0 && tData[0].stazione != 0" 
                class="card md:hidden"
                :class="{
                    'hidden': tData[0].stazione == 0,
                }"
            >
                <div class="card-title text-xs">
                    <p class="stationId">{{ $t('station') }} {{ tData[0].stazione }}</p>
                    <div class="flex flex-row gap-1 justify-center items-center cursor-pointer" v-if="editedNameStation != tData[0].stazione" @click="editName(tData[0].stazione)">
                        <p>{{ tData[0].group }}</p>
                        <img src="@/assets/material_edit.png" id="editName" class="w-4 h-4">
                    </div>
                    <div v-if="editedNameStation == tData[0].stazione" class="flex flex-row gap-1 justify-center items-center">
                        <input type="text" class="border p-1 text-xs" v-model="tData[0].group">
                        <IveButton @click="saveName(tData[0].stazione, tData[0].group, tData)" class="filled__blue !text-xs h-[24px]" :label="$t('save')" :loading="postControlIsLoading"/>
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

                        <tbody>
                            <tr v-for="(item, index) in tData" :key="index">
                                <td class="itemCell w-10 hover:cursor-not-allowed">{{ index + 1 }}</td>

                                <draggable 
                                    :list="[item.id]"
                                    group="ev"
                                    :itemKey="x => x"
                                    @change="log"
                                    :disabled="!isEditing || tData[0].stazione == 0" 
                                    :move="(_, originalEvent) => startDrag(originalEvent, 'ev', item.stazione, item.id, item.id)"
                                    @start="event => startDrag(event, 'ev', item.stazione, item.id, item.id)"
                                    @end="endDrag"
                                    tag="td"
                                    class="itemCell"
                                    :class="{canDrop: tData[0].stazione > 0 && draggedCellType == 'ev', cannotDrop: tData[0].stazione > 0 && !['ev', undefined].includes(draggedCellType)}" 
                                >
                                    <template #item="{element}">
                                        <span 
                                            class="itemCell"
                                            :class="{canDrop: tData[0].stazione > 0 && draggedCellType == 'ev', cannotDrop: tData[0].stazione > 0 && !['ev', undefined].includes(draggedCellType)}" 
                                        >
                                            {{ getFormattedItemCell('ev', element) }}
                                        </span>
                                    </template>
                                </draggable>

                                <draggable 
                                    :list="[item.pompa]"
                                    group="pump"
                                    :itemKey="x => x"
                                    @change="log"
                                    :disabled="!isEditing || tData[0].stazione == 0" 
                                    :move="(_, originalEvent) => startDrag(originalEvent, 'pump', item.stazione, item.pompa, item.id)"
                                    @start="event => startDrag(event, 'pump', item.stazione, item.pompa, item.id)"
                                    @end="endDrag"
                                    tag="td"
                                    class="itemCell"
                                    :class="{canDrop: tData[0].stazione > 0 && draggedCellType == 'pump', cannotDrop: tData[0].stazione > 0 && !['pump', undefined].includes(draggedCellType)}" 
                                >
                                    <template #item="{element}">
                                        <span 
                                            class="itemCell"
                                            :class="{canDrop: tData[0].stazione > 0 && draggedCellType == 'pump', cannotDrop: tData[0].stazione > 0 && !['pump', undefined].includes(draggedCellType)}" 
                                        >{{ getFormattedItemCell('pump', element) }}</span>
                                    </template>
                                </draggable>

                                <draggable 
                                    :list="[item.masterv]"
                                    group="master"
                                    :itemKey="x => x"
                                    @change="log"
                                    :disabled="!isEditing || tData[0].stazione == 0" 
                                    :move="(_, originalEvent) => startDrag(originalEvent, 'master', item.stazione, item.masterv, item.id)"
                                    @start="event => startDrag(event, 'master', item.stazione, item.masterv, item.id)"
                                    @end="endDrag"
                                    tag="td"
                                    class="itemCell"
                                    :class="{canDrop: tData[0].stazione > 0 && draggedCellType == 'master', cannotDrop: tData[0].stazione > 0 && !['master', undefined].includes(draggedCellType)}"
                                >
                                    <template #item="{element}">
                                        <span
                                            class="itemCell"
                                            :class="{canDrop: tData[0].stazione > 0 && draggedCellType == 'master', cannotDrop: tData[0].stazione > 0 && !['master', undefined].includes(draggedCellType)}" 
                                        >{{ getFormattedItemCell('master', element) }}</span>
                                    </template>
                                </draggable>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- view for larger device than mobile -->
            <div v-for="(tData, index) in data" 
                :key="index" 
                v-show="tData.length > 0 && tData[0].stazione != 0" 
                class="card hidden"
                :class="{
                    'md:block': tData[0].stazione != 0,
                }"
            >
                <div class="card-title text-xs">
                    <p class="stationId">{{ $t('station') }} {{ tData[0].stazione }}</p>
                    <div class="flex flex-row gap-1 justify-center items-center cursor-pointer" v-if="editedNameStation != tData[0].stazione" @click="editName(tData[0].stazione)">
                        <p>{{ tData[0].group }}</p>
                        <img src="@/assets/material_edit.png" id="editName" class="w-4 h-4">
                    </div>
                    <div v-if="editedNameStation == tData[0].stazione" class="flex flex-row gap-1 justify-center items-center">
                        <input type="text" class="border p-1 text-xs" v-model="tData[0].group">
                        <IveButton @click="saveName(tData[0].stazione, tData[0].group, tData)" class="filled__blue !text-xs h-[24px]" :label="$t('save')" :loading="postControlIsLoading"/>
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
                        <tbody>
                            <tr v-for="(item, index) in tData" :key="index">
                                <td class="itemCell w-10 hover:cursor-not-allowed">{{ index + 1 }}</td>

                                <td
                                    class="itemCell"  
                                    :class="{canDrop: tData[0].stazione > 0 && draggedCellType == 'ev', cannotDrop: tData[0].stazione > 0 && !['ev', undefined].includes(draggedCellType)}" 
                                    :draggable="isEditing && tData[0].stazione > 0" 
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
                                    :draggable="isEditing && tData[0].stazione > 0" 
                                    v-on:dragenter="draggedCellType == 'pump' ? $event.preventDefault() : null"
                                    v-on:dragover="draggedCellType == 'pump' ? $event.preventDefault() : null"
                                    @drop="onDrop('pump', item.stazione, item)"
                                    @dragstart="startDrag($event, 'pump', item.stazione, item.pompa, item.id)" 
                                    @dragend="endDrag()">
                                    {{ getFormattedItemCell('pump', item.pompa) }}</td>
                                <td
                                    class="itemCell" 
                                    :class="{canDrop: tData[0].stazione > 0 && draggedCellType == 'master', cannotDrop: tData[0].stazione > 0 && !['master', undefined].includes(draggedCellType)}" 
                                    :draggable="isEditing && tData[0].stazione > 0" 
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

        <div class="flex flex-row space-x-4 md:hidden">
            <IveButton class="text-xs filled green" @click="showList('ev')" :label="$t('ev')" />
            <IveButton class="text-xs filled green" @click="showList('pump')" :label="$t('pump')" />
            <IveButton class="text-xs filled green" @click="showList('master')" :label="$t('evMaster')" />
        </div>
    </div>
</template>

<script setup>
import { ref } from '@vue/reactivity';
import IveButton from '@/components/button/BaseButton.vue';
import { useDataStore } from '@/stores/DataStore';
import { storeToRefs } from 'pinia'
import { computed } from 'vue';
import draggable from 'vuedraggable'

const props = defineProps({
    id: String,
    pumpList: null,
    masterList: null,
    data: null,
    deviceCode: null,
    rawData: null,
    unassignedEvs: null,
    availableGroup: null,
    newGroups: null,
    loadData: Function
})

const emit = defineEmits(['reset', 'save'])
const dataStore = useDataStore()
const { postControlIsLoading } = storeToRefs(useDataStore())

const isLoading = ref(false)
const isEditing = ref(false)
const shouldReset = ref(false)

const isError = ref(false)
const modalActive = ref(false)
const modalMessage = ref('')

// groups
const selectedGroup = ref('')

// name editing
const isEditingName = ref(false)
const editedNameStation = ref(null)

const showEvList = ref(false)
const showPumpList = ref(false)
const showMasterList = ref(false)

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

function editName(station) {
    isEditingName.value = true
    editedNameStation.value = station
}

function saveName(stationId, groupName, tData) {
    postGroupData.value.payload = {}

    if (tData) {
        setGroupName(stationId, groupName, tData)
    }

    let address = 6000 + Number(stationId) - 1
    postGroupData.value.payload['S' + address] = groupName
    dataStore.postControl(props.deviceCode, postGroupData.value)

    if (isEditingName.value) {
        isEditingName.value = false
        editedNameStation.value = null
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
            showEvList.value = !showEvList.value
            showPumpList.value = false
            showMasterList.value = false
            break;
        case 'pump':
            showEvList.value = false
            showPumpList.value = !showPumpList.value
            showMasterList.value = false
            break;
        case 'master':
            showEvList.value = false
            showPumpList.value = false
            showMasterList.value = !showMasterList.value
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
    console.log('startDrag', event, cellType, stazione, id, rowId, serial)
    if (event?.dataTransfer) {
        event.dataTransfer.dropEffect = "move"
        event.dataTransfer.effectAllowed = "move"
    }

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
    }
    
    currentItem[cellKey] = draggedId
    
    // set dragged cell value to current item value
    if (!fromPumpList && !fromMasterList) {
        if (isEvCell) {
            draggedItem.ev = tempCurrentItem.ev
        }
        
        draggedItem[cellKey] = tempCurrentItem[cellKey]
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

function addRowToNewGroup(group, id) {
    const item = props.rawData.find(x => x.id == id)
    item.group = group.title
    item.stazione = group.stazione

    const index = props.newGroups.findIndex(x => x.address == group.address)
    props.newGroups.splice(index, 1)
}

function confirmReset() {
    shouldReset.value = true
}

async function reset() {
    shouldReset.value = false
    isEditing.value = false
    isLoading.value = true

    emit('reset')
    await props.loadData()

    isLoading.value = false
}

async function saveData() {
    isEditing.value = false
    isLoading.value = true
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

    const error = await dataStore.postControl(props.deviceCode, postData.value) // this return error object if error

    if (error) {
        // modalMessage.value = error.message
        modalMessage.value = 'Failed to save data'
        isError.value = true
    } else {
        await props.loadData()
        modalMessage.value = 'Data saved successfully'
        isError.value = false
    }

    isLoading.value = false
    modalActive.value = true
    setTimeout(closeNotification, 3000)
}

const closeNotification = () => {
    modalActive.value = false
}

function addGroup() {
    if (selectedGroup.value == '') {
        return
    }

    let index = props.availableGroup.findIndex(x => x.address == selectedGroup.value)
    const removedArr = props.availableGroup.splice(index, 1)
    const group = removedArr[0]
    group.stazione = Number(group.address.slice(1)) + 1 - 6000 // get 4 from S6003, 5 from S6004, etc
    
    props.newGroups.push(group)
    selectedGroup.value = ''
}

function log(event)  {
    console.log('log', event)
}

</script>

<style scoped>
.card-container {
    @apply grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4;
}

.card {
    @apply p-3 bg-white rounded-lg shadow-lg;
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
    @apply
    w-[100px]
    h-[40px]
    text-center
    text-xs
    justify-center
    rounded
    bg-gray-100
    transition-colors
    duration-100
    ease-in
    select-none;

    cursor: v-bind('isEditing ? "pointer" : "default"');
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
    @apply 
    fixed p-4 z-10 bottom-0 w-full h-[250px]
    md:right-0 md:w-1/5 md:h-full md:bottom-auto
}

.modalList {
    @apply
     flex flex-col bg-white shadow-2xl rounded-2xl py-6 px-4 h-full
     md:h-1/2
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

</style>