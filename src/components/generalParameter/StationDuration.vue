<template>
    <form @submit.prevent="onSubmit" class="table-container">
        <div>
            <h1 class="flex font-bold">{{ $t('stationsDuration') }}</h1>
            <div class="mb-2 flex">
                <label>Stato:</label>
                <label class="hlight">{{ programEnabledString }}</label>
            </div>
        </div>
        <table :tableHeader="tableHeader" :set="ndx = 1">
            <thead>
                <tr>
                    <!--<th v-for="tHead in tableHeader" :key="tHead" :class="tHead">
                {{tHead}}
              </th>-->
                    <th name="Sposta" class="tHead">
                        {{ tableHeader[0] }}
                    </th>
                    <th name="Ordine" class="tHead">
                        {{ tableHeader[1] }}
                    </th>
                    <th name="Stazione" class="tHead">
                        {{ tableHeader[2] }}
                    </th>
                    <th name="Gruppo" class="tHead">
                        {{ tableHeader[3] }}
                    </th>
                    <th name="EV" class="tHead">
                        {{ tableHeader[4] }}
                    </th>
                    <th name="Stato" class="tHead">
                        {{ tableHeader[5] }}
                    </th>
                    <th v-if="evFlowMode === 2" name="Ore" class="tHead">
                        {{ tableHeader[6] }}
                    </th>
                    <th v-if="evFlowMode === 1 || evFlowMode === 2" name="Minuti" class="tHead">
                        {{ tableHeader[7] }}
                    </th>
                    <th v-if="evFlowMode === 1" name="Secondi" class="tHead">
                        {{ tableHeader[8] }}
                    </th>
                    <th v-if="evFlowMode === 0" name="Volume" class="tHead">
                        {{ tableHeader[9] }}
                    </th>
                    <th name="Rimuovi Step" class="tHead">
                        {{ tableHeader[10] }}
                    </th>
                </tr>
            </thead>
            <tr v-if="rowsData.length == [] && !isLoading">
                <td colspan="9" class="w-full">
                    No Station
                </td>
            </tr>
            <tr v-if="isLoading">
                <td colspan="9" class="w-full">
                    <div class="flex justify-center">
                        <svg aria-hidden="true"
                            class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor" />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill" />
                        </svg>
                    </div>
                </td>
            </tr>
            <tr v-if="!isLoading" v-for="(tData, index) in rowsData" :key="index">

                <td name="Sposta" class="w-10">
                    <div class="mp-div">
                        <div style="display:flex;flex-direction: row;align-items: center;margin-left:10px">
                            <button type="button" class="filled__blue" @click="moveStep(index, 0)">
                                <img src="@/assets/su.png" style="max-width:32px">
                            </button>
                            <button type="button" class="filled__blue" @click="moveStep(index, 1)"
                                style="margin-left:10px;">
                                <img src="@/assets/giu.png" style="max-width:32px">
                            </button>
                        </div>
                    </div>
                </td>

                <td name="Ordine partenza" class="w-05">
                    <label class="index" style="font-weight:bold;">{{ ndx }}</label>
                </td>

                <td :id="tData.prgStep" name="ID Stazione" class="w-05" style="text-align:left" :set="ndx = ndx + 1">
                    <label style="font-weight:bold;">{{ Number(tData.stationID) }} </label>
                </td>

                <td class="w-20" name="Gruppo" style="text-align:left">
                    <!--<label style="font-weight:bold;">{{tData.grpName}}</label>-->
                    <select :value="tData.stationID" class="dropdown w-40" @change="moveOnSelect($event, index)">
                        <option v-for="groupObj in swapGroups" :value="groupObj.station">
                            {{ groupObj.group }}
                        </option>
                    </select>
                </td>

                <td class="w-10" name="Elettrovalvole">
                    <div class="ev-list">
                        <label style="font-weight:bold;" v-for="valve in tData.gruppiEv">{{ valve.ev }}</label>
                    </div>
                </td>

                <td name="Status" class="w-05">
                    <select v-model="tData.station_status" name="ingresso-1" class="dropdown"
                        @change="updateStationStatus(tData.id, tData.station_status)">
                        <option value="OFF">OFF</option>
                        <option value="ON">ON</option>
                    </select>
                </td>

                <td name="Ore" class="w-05" v-if="evFlowMode === 2">
                    <input type="number" v-model="tData.ore">
                </td>

                <td name="Minuti" class="w-05" v-if="evFlowMode === 1 || evFlowMode === 2">
                    <input type="number" v-model="tData.min">
                </td>

                <td name="Secondi" class="w-05" v-if="evFlowMode === 1">
                    <input type="number" v-model="tData.sec">
                </td>

                <td name="Volume" class="w-05" v-if="evFlowMode === 0">
                    <input type="number" v-model="tData.volume">
                </td>

                <td name="Rimuovi step" class="w-10">
                    <div
                        style="display:flex;flex-direction: row;align-items: center;margin-left:10px; justify-content: center;">
                        <button type="button" @click="removeProgramStep(index)">
                            <img src="@/assets/cancella.png" style="max-width:32px">
                        </button>
                    </div>
                </td>

            </tr>
        </table>

        <div class="button-bar">
            <div class="w-50">
                <div class="search-bar">
                    <select v-model="selectedGroup" name="Gruppi" class="dropdown w-30">
                        <option v-for="(groupObj, index) in evGroups" :value="index">
                            {{ groupObj.group }}
                        </option>
                    </select>
                    <button :disabled="isLoading" type="button" class="filled_green mp-button mlw-30" @click="addStep()">{{ $t('addGroup')
                        }}</button>
                </div>
            </div>
            <div class="button-wrapper no-margin">
                <MyButton type="submit" class="filled" :label="$t('save')" :loading="isLoading" />
            </div>
        </div>
    </form>
</template>

<script setup>
import { useDataStore } from '@/stores/DataStore';
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from '@vue/runtime-core'
import MyButton from '@/components/button/BaseButton.vue'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import dataAPI from '@/services/dataAPI'

let maxRows = 0;
let programSteps = 96; // in teoria dovrebbero essere 95 ma c'è un bug nel firmware
let workModeRegister = computed(() => 'S' + (base_reg + 6));
let timeModeRegister = computed(() => 'S' + (base_reg + 1));
let timeMode = 0
let workMode = 1
let programEnabledString = "OFF"
let programName = "P.01";
let evFlowMode = 0;
let selectedGroup = 0;
let lastStep = 0;

//props
const props = defineProps({
    id: String,
    programNumber: Number,
    base_reg: Number,
    device_code: String,
    parentIsLoading: Boolean,
    programConfig: Object
})

//state
const dataStore = useDataStore()
const { postControlIsLoading } = storeToRefs(useDataStore())
const localIsLoading = ref(false)
//refactoring evStation from S10200
let startEvStation = computed(() => (props.programNumber * 1000) + 10200);

const isLoading = computed(() => localIsLoading.value || props.parentIsLoading || postControlIsLoading.value)

const evStationValue = computed(() => {
    return Object.keys(evStation).
        filter(val => (val.replace('S', '') * 1 >= startEvStation.value)).
        reduce((acc, key) => { return Object.assign(acc, { [key]: evStation[key] }) }, {});
});

//refactoring evStation from S10100
const startStationTime = computed(() => (props.programNumber * 1000) + 10100)
const endStationTime = startEvStation;

const evStationTime = computed(() => {
    return Object.keys(evStation).
        filter(val => (val.replace('S', '') >= startStationTime.value && val.replace('S', '') < endStationTime.value)).
        reduce((acc, key) => { return Object.assign(acc, { [key]: evStation[key] }) }, {});
});

//api loading
const evData = ref([])
const groupedTableData = ref([])
groupedTableData.value = [];

//NB optionValue è il numero programma
//const rows = ref([...Array(maxRows)].map( (_, index) => index + 1 ));
const rowsData = ref([]);

const evConfFields = [...Array(1152)].map((_, index) => `S${2000 + index}`).join(',');
const evConfigParams = ref({
    fields: evConfFields,
    measurement: 'EVCONFIG',
    device_code: null
})

//MV legge la configurazione dei gruppi registri da 6000 a 6095
const grConfFields = [...Array(1152)].map((_, index) => `S${6000 + index}`).join(',');
const grConfigParams = ref({
    fields: grConfFields,
    measurement: 'GROUPCONFIG',
    device_code: null
})

const evStationParams = ref({
    fields: [...Array(196)].map((_, index) => `S${10100 + index}`).join(','), //MV imposta il settaggio per il singolo programma index va da 1 a 30
    measurement: 'SATPRGTIMES1',
    device_code: null
})

let evConfig = null
let evStation = null

defineExpose({
    refreshData
})

watch(() => props.device_code, async (newDeviceCode) => {
    setDeviceCode(newDeviceCode)
})

watch(() => [props.programNumber, props.base_reg, props.programConfig], ([newProgNum, newBaseReg], _) => {
    onOptionChanged(newProgNum, newBaseReg)
})

function refreshData() {
    const { programNumber, base_reg } = props;
    onOptionChanged(programNumber, base_reg)
}

function setDeviceCode(deviceCode) {
    evConfigParams.value.device_code = deviceCode
    evStationParams.value.device_code = deviceCode
    grConfigParams.value.device_code = deviceCode
}

function updateStationStatus(index, station_status) {
    [...(rowsData.value[index - 1]['station_status'] = station_status)]
}


function moveOnSelect(event, currentPos) {
    var oldPosition = currentPos
    var newPosition = event.target.selectedIndex//getProgramStepByGroupID(groupID, currentPos)

    if (newPosition > -1) {
        swapStep(oldPosition, newPosition)
        //Aggionro la select
        swapSelectItems(oldPosition, newPosition)
    }
}

function getProgramInfo(programNumber, base_reg) {
    const { programConfig } = props;

    let programEnabledRegister = 'S' + (base_reg);
    let programNameRegister = "S" + (base_reg + 4);
    let programEnabled = programConfig === undefined ? '0' : programConfig[programEnabledRegister]

    if (programEnabled == 0) {
        programEnabledString = "ON"
    } else {
        programEnabledString = "OFF"
    }

    //MV leggo il nome del programma. 
    programName = "P." + String(programNumber + 1).padStart("2", '0');
    if (programConfig !== undefined) {
        programName = programConfig[programNameRegister]
    }

    workModeRegister = 'S' + (base_reg + 6);
    timeModeRegister = 'S' + (base_reg + 1);

    timeMode = programConfig === undefined ? '0' : programConfig[timeModeRegister]
    workMode = programConfig === undefined ? '1' : programConfig[workModeRegister]

    console.log("satConfig", programConfig)
    console.log("workModeRegister: ", workModeRegister, "timeModeRegister: ", timeModeRegister)
    console.log("workMode: ", workMode, "timeMode: ", timeMode)

    if (workMode === '0') {//Lavora a volume
        evFlowMode = 0
    } else if (timeMode === '0') {//min:sec
        evFlowMode = 1
    } else {//ore:min
        evFlowMode = 2
    }

}

let evGroups = [];
//MP refactoring/semplificazione del codice
//NB optionValue è il numero programma
function fillEvConfigData() {
    const { base_reg } = props
    evGroups = [];
    postEvStationData.value.payload = {}
    evData.value = []
    let evIndex = 2000
    let groupIndex = 6000
    let i = 0
    //////////////////////////////////////

    const evConfigLength = evConfig === undefined ? 0 : Object.keys(evConfig).length - 6

    for (let iFor = 0; iFor < evConfigLength / 5; iFor++) {

        if (evConfig.hasOwnProperty('S' + evIndex)) {
            if (evConfig['S' + evIndex] !== "FFFFFF") {

                var flowMode = {};

                //////////////
                //Creo i registri
                let registroStazione = 'S' + Number(evIndex + 2);

                let stazioneID = Number(evConfig[registroStazione]);

                if (stazioneID > 0) {
                    stazioneID -= 1;
                }

                let timeRegister = 'S' + (base_reg + Number(100 + stazioneID));
                let orderRegister = 'S' + (base_reg + Number(200 + stazioneID));
                let groupRegister = 'S' + Number(groupIndex + stazioneID)
                //////////////

                flowMode.ore = 0;
                flowMode.min = 0;
                flowMode.sec = 0;
                flowMode.volume = 0;

                switch (evFlowMode) {
                    case 0:
                        //Volume
                        if (evStation !== undefined) {
                            flowMode.volume = parseFloat(evStation[timeRegister])
                        }
                        break;
                    case 1:

                        //Minuti / Secondi
                        let tmpMinSec = undefined;

                        if (evStation !== undefined) {
                            tmpMinSec = evStation[timeRegister]?.split('.')
                        }

                        flowMode.min = 0;

                        if (tmpMinSec === undefined) {
                            flowMode.min = 0;
                            flowMode.sec = 0;
                        } else {
                            flowMode.min = tmpMinSec[0] === undefined ? 0 : tmpMinSec[0]
                            flowMode.sec = tmpMinSec[1] === undefined ? 0 : tmpMinSec[1]
                        }

                        break;
                    case 2:
                        //Ore / Minuti
                        let tmpOreMin = undefined;

                        if (evStation !== undefined) {
                            tmpOreMin = evStation[timeRegister]?.split('.')
                        }

                        if (tmpOreMin === undefined) {
                            flowMode.ore = 0
                            flowMode.min = 0
                        } else {
                            flowMode.ore = tmpOreMin[0] === undefined ? 0 : tmpOreMin[0]
                            flowMode.min = tmpOreMin[1] === undefined ? 0 : tmpOreMin[1]
                        }

                        break;
                }

                //////////////
                let tmpStatus = undefined;

                if (evStation !== undefined) {
                    tmpStatus = evStation[orderRegister]?.split(',')
                }
                //////////////

                //////////////
                let tmpGrpName = "ERR." + String(stazioneID).padStart(2, "0")

                if (dataStore.groupData !== undefined) {
                    tmpGrpName = dataStore.groupData[groupRegister]
                }

                evGroups.push({ group: tmpGrpName, station: stazioneID });
                //forzatura per debug
                //evGroups.push({group : tmpGrpName, station : stazioneID});
                //////////////

                let obj = {
                    id: i,
                    ev: evConfig === undefined ? 'no name' : evConfig['S' + evIndex],
                    stazione: evConfig === undefined ? '1' : evConfig[registroStazione],
                    status: tmpStatus === undefined ? '1' : tmpStatus[1],
                    volume: flowMode.volume,
                    ore: flowMode.ore,
                    min: flowMode.min,
                    sec: flowMode.sec,
                    prgName: programName,
                    grpName: tmpGrpName,
                }
                evData.value.push(obj);

                i++;
            }
        }
        evIndex += 6
    }

    var TmpEvGroups = [];
    TmpEvGroups = Array.from(new Map(evGroups.map(item => [item['group'], item])).values());
    evGroups = TmpEvGroups;
}

function groupingTableData() {
    groupedTableData.value = evData.value.reduce((r, a) => { //modificare per riordinamento
        r[a.stazione] = [...r[a.stazione] || [], a];
        return r;
    }, {})

    //Passo il maxRows per caricare le righe. 
    maxRows = Object.keys(groupedTableData.value).length;
}

onMounted(async () => {
    localIsLoading.value = true
    setDeviceCode(props.device_code)

    await Promise.all([
        dataStore.getLastGroupData(grConfigParams.value),
        onOptionChanged(props.programNumber, props.base_reg)
    ])

    //Rimuovo i doppioni eventuali dalla lista di gruppi e stazioni
    var TmpEvGroups = [];
    TmpEvGroups = Array.from(new Map(evGroups.map(item => [item['group'], item])).values());

    evGroups = TmpEvGroups;
    TmpEvGroups = [];
    localIsLoading.value = false
})



function swapStep(oldIndex, newIndex) {
    var newPosition = newIndex;
    var oldPosition = oldIndex;

    var tempRow = rowsData.value[oldPosition];
    var tempPrgStep = tempRow.prgStep;
    var tempTmField = tempRow.tmfield;


    var newPrgStep = rowsData.value[newPosition].prgStep;
    var newTimeField = rowsData.value[newPosition].tmfield;

    rowsData.value[oldPosition] = rowsData.value[newPosition];
    rowsData.value[newPosition] = tempRow;

    rowsData.value[oldPosition].prgStep = tempPrgStep;
    rowsData.value[oldPosition].tmfield = tempTmField;

    rowsData.value[newPosition].prgStep = newPrgStep;
    rowsData.value[newPosition].tmfield = newTimeField;

    var newElement = document.getElementById(newPrgStep);
    var oldElement = document.getElementById(tempPrgStep);
    newElement.classList.add("blink_green");
    oldElement.classList.add("blink_yellow");

    setTimeout(function () {
        newElement.classList.remove("blink_green");
        oldElement.classList.remove("blink_yellow");
    }, 1000);
    return;
}

function moveStep(index, direction) {
    //Muovo sopra
    if (direction == 0 && index == 0) {
        //non fare nulla
        return;
    }

    //Muovo sotto
    if (direction == 1 && index == maxRows - 1) {
        //non fare nulla
        return;
    }

    var newPosition = -1;
    var oldPosition = index;

    var tempRow = rowsData.value[oldPosition];
    var tempPrgStep = tempRow.prgStep;
    var tempTmField = tempRow.tmfield;

    if (direction == 0) {
        newPosition = oldPosition - 1;
    } else {
        newPosition = oldPosition + 1;
    }

    var newPrgStep = rowsData.value[newPosition].prgStep;
    var newTimeField = rowsData.value[newPosition].tmfield;

    rowsData.value[oldPosition] = rowsData.value[newPosition];
    rowsData.value[newPosition] = tempRow;

    rowsData.value[oldPosition].prgStep = tempPrgStep;
    rowsData.value[oldPosition].tmfield = tempTmField;

    rowsData.value[newPosition].prgStep = newPrgStep;
    rowsData.value[newPosition].tmfield = newTimeField;

    var newElement = document.getElementById(newPrgStep);
    var oldElement = document.getElementById(tempPrgStep);
    newElement.classList.add("blink_green");
    oldElement.classList.add("blink_yellow");

    swapSelectItems(oldPosition, newPosition)

    setTimeout(function () {
        newElement.classList.remove("blink_green");
        oldElement.classList.remove("blink_yellow");
    }, 1000);
    return;
}

function swapSelectItems(oldPosition, newPosition) {
    var tmpGrp = swapGroups[oldPosition]
    swapGroups[oldPosition] = swapGroups[newPosition]
    swapGroups[newPosition] = tmpGrp
}

function addStep() {
    if (lastStep >= programSteps) return;

    var objGroup = evGroups[selectedGroup];
    var step = lastStep
    var id = step + 1;
    var stationId = objGroup.station + 1

    let oneitem = {
        id: id,
        gruppiEv: getEvGroupsByStationId(stationId, Object.values(groupedTableData._rawValue)), //Restituisce i gruppi di elettrovalvole per stazione
        stationID: stationId,
        // selected_station: stationId, 
        station_status: 'OFF',
        grpName: objGroup.group,
        volume: 0,
        ore: 0,
        min: 0,
        sec: 0,
        prgStep: Object.keys(evStationValue.value)[step],
        tmfield: Object.keys(evStationTime.value)[step]
    }
    rowsData.value.push(oneitem);
    swapGroups.push({ group: objGroup.group, station: stationId });
    maxRows++;
    lastStep++;
}

function removeProgramStep(step) {
    if (lastStep < 0) return;
    //if (rowsData.value.length > 1 && (step>=0 && step<rowsData.value.length))
    //{
    swapGroups.splice(step, 1)
    rowsData.value.splice(step, 1)
    //}

    //Riordino il programstep e il timestep
    var step = 0;
    rowsData.value.forEach(function (row) {
        row.prgStep = Object.keys(evStationValue.value)[step]
        row.tmfield = Object.keys(evStationTime.value)[step]
        step++
    })

    lastStep--;
}


function getEvGroupsByStationId(StazioneId, groupData) {
    for (var i = 0; i < groupData.length; i++) {
        if (Array.isArray(groupData[i])) {
            if (groupData[i][0].stazione == StazioneId) {
                //Assegna il nome del gruppo del primo elemento a tutti gli elementi successivi
                if (groupData[i].length > 1) {
                    for (var x = 1; x < groupData[i].length; x++) {
                        groupData[i][x].grpName = groupData[i][0].grpName;
                    }
                }
                ///////////////////////////////////////////////////////////////////////////////
                return groupData[i];
            }
        } else {
            if (groupData[i].stazione == StazioneId) {
                return groupData[i];
            }
        }
    }

    return [];
}

function getGroupByStationId(StazioneId, evData) {
    for (var i = 0; i < evData.length; i++) {
        if (Array.isArray(evData[i])) {
            if (evData[i][0].stazione == StazioneId) {
                return evData[i][0].grpName;
            }
        } else {
            if (evData[i].stazione == StazioneId) {
                return evData[i].grpName;
            }
        }
    }

    return "";
}

function getFlowValueByStep(step) {
    var flowObject = {};
    flowObject.ore = 0;
    flowObject.min = 0;
    flowObject.sec = 0;
    flowObject.volume = 0;

    switch (evFlowMode) {
        case 0:
            //Volume
            if (evStationTime !== undefined) {
                flowObject.volume = parseFloat(evStationTime.value[Object.keys(evStationTime.value)[step]])
            }
            break;
        case 1:

            //Minuti / Secondi
            let tmpMinSec = undefined;

            if (evStationTime !== undefined) {
                tmpMinSec = evStationTime.value[Object.keys(evStationTime.value)[step]]?.split('.')
            }

            flowObject.min = 0;

            if (tmpMinSec === undefined) {
                flowObject.min = 0;
                flowObject.sec = 0;
            } else {
                flowObject.min = tmpMinSec[0] === undefined ? 0 : tmpMinSec[0]
                flowObject.sec = tmpMinSec[1] === undefined ? 0 : tmpMinSec[1]
            }

            break;
        case 2:

            //Ore / Minuti

            let tmpOreMin = undefined;

            if (evStationTime !== undefined) {
                tmpOreMin = evStationTime.value[Object.keys(evStationTime.value)[step]]?.split('.')
            }

            if (tmpOreMin === undefined) {
                flowObject.ore = 0
                flowObject.min = 0
            } else {
                flowObject.ore = tmpOreMin[0] === undefined ? 0 : tmpOreMin[0]
                flowObject.min = tmpOreMin[1] === undefined ? 0 : tmpOreMin[1]
            }
            break;
    }

    return flowObject;
};

let swapGroups = [];
function addRow(refresh = false) {
    const { base_reg } = props

    if (refresh) rowsData.value = []
    swapGroups = [];

    let step = 0;

    var orderRegister = '';

    for (step = 0; step < programSteps; step++) {
        orderRegister = 'S' + (base_reg + Number(200 + step));
        let stationId = evStation[orderRegister]?.split(',')[0];

        if (stationId > 0) {
            var flowMode = getFlowValueByStep(step);

            var tmpGrpName = getGroupByStationId(stationId, Object.values(evData._rawValue))

            let oneitem = {
                id: Number(step + 1),
                gruppiEv: getEvGroupsByStationId(stationId, Object.values(groupedTableData._rawValue)), //Restituisce i gruppi di elettrovalvole per stazione
                stationID: stationId,
                //selected_station: stationId, 
                station_status: evStationValue.value[Object.keys(evStationValue.value)[step]]?.split(',')[1] * 1 ? 'ON' : 'OFF',
                grpName: tmpGrpName,
                volume: flowMode.volume,
                ore: flowMode.ore,
                min: flowMode.min,
                sec: flowMode.sec,
                prgStep: Object.keys(evStationValue.value)[step],
                tmfield: Object.keys(evStationTime.value)[step]
            }
            rowsData.value.push(oneitem);
            swapGroups.push({ group: tmpGrpName, station: stationId });
            lastStep++;
        }
        else {
            //console.error("Stazione non trovata per lo step: ", step);
        }
    }
}

//NB optionValue è il numero programma
async function onOptionChanged(programNumber, base_reg) {
    rowsData.value = []
    localIsLoading.value = true

    evStationParams.value.fields = [...Array(196)].map((_, index) => `S${startStationTime.value + index}`).join(',');
    evStationParams.value.measurement = String('SATPRGTIMES' + (programNumber + 1))

    const promises = await Promise.all([
        dataAPI.getLast(evConfigParams.value),
        dataAPI.getLast(evStationParams.value)
    ])

    evConfig = promises[0]?.data?.data
    evStation = promises[1]?.data?.data

    getProgramInfo(programNumber, base_reg)
    fillEvConfigData()
    groupingTableData()
    addRow(true)
    localIsLoading.value = false

}

const postEvStationData = ref({
    command: 'SATPRGTIMES1',
    payload: {}
})

function setEvParamsByStationId(StazioneId, groupData, volume, ore, min, sec, status) {
    for (var i = 0; i < groupData.length; i++) {
        if (Array.isArray(groupData[i])) {
            if (groupData[i][0].stazione == StazioneId) {
                //Assegna il valori di tempo e status tutti gli elementi successivi
                if (groupData[i].length > 1) {
                    for (var x = 0; x < groupData[i].length; x++) {
                        groupData[i][x].volume = volume;
                        groupData[i][x].ore = ore;
                        groupData[i][x].min = min;
                        groupData[i][x].sec = sec;
                        groupData[i][x].status = status;
                    }
                } else {
                    groupData[i][0].volume = volume;
                    groupData[i][0].ore = ore;
                    groupData[i][0].min = min;
                    groupData[i][0].sec = sec;
                    groupData[i][0].status = status;
                }
                ///////////////////////////////////////////////////////////////////////////////
                return;
            }
        }
    }

    return;
}

function chunk(arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
    );
}


function onSubmit() {
    const { base_reg, programNumber } = props
    //Imposto i valori per tutti i passi
    var step = 0;
    //NB optionValue è il numero programma

    postEvStationData.value.command = "SATPRGTIMES" + String(programNumber + 1)
    postEvStationData.value.payload = []

    var orderRegister = '';
    var timeRegister = '';

    for (step = 0; step < programSteps; step++) {
        orderRegister = 'S' + (base_reg + Number(200 + step));
        timeRegister = 'S' + (base_reg + Number(100 + step));

        var flowValueString = "0"
        switch (evFlowMode) {
            case 0:
                flowValueString = "0"
                break;
            case 1:
            case 2:
                flowValueString = "0.00"
                break;
        }
        postEvStationData.value.payload[timeRegister] = flowValueString;
        postEvStationData.value.payload[orderRegister] = '0,0';
    }

    rowsData.value.forEach(x => {
        setEvParamsByStationId(x.stationID, Object.values(groupedTableData._rawValue), x.volume, x.ore, x.min, x.sec, (x.station_status == 'ON' ? 1 : 0))
        var flowValueString = "0"
        switch (evFlowMode) {
            case 0:
                flowValueString = String(x.volume);
                break;
            case 1:
                flowValueString = String(x.min) + "." + String(x.sec)
                break;
            case 2:
                flowValueString = String(x.ore) + "." + String(x.min)
                break;
        }

        postEvStationData.value.payload[x.tmfield] = flowValueString;
        postEvStationData.value.payload[x.prgStep] = `${x.stationID},${x.station_status == 'ON' ? 1 : 0}`;
    });



    //debugger
    let keys = Object.keys(postEvStationData.value.payload).filter(key => !postEvStationData.value.payload[key].includes('undefined'))

    let validPayload = {};
    keys.map(xx => validPayload[xx] = postEvStationData.value.payload[xx]);


    let payloadArray = Object.entries(validPayload)
    let payloadLength = payloadArray.length / 2
    let maxRegister = 30 * 2
    if (payloadLength > maxRegister) {
        let payloadChunks = chunk(payloadArray, maxRegister)

        //arr.reduce((a, v) => ({ ...a, [v]: v}), {})
        for (var x = 0; x < payloadChunks.length; x++) {
            var objToSend = payloadChunks[x].reduce(function (result, item) {
                var key = item[0];
                var value = item[1];
                //var obj = {};
                result[key] = value;
                return result;
            }, {});

            dataStore.postControl(evConfigParams.value.device_code, { "command": postEvStationData.value.command, "payload": objToSend })
        }

    } else {
        dataStore.postControl(evConfigParams.value.device_code, { "command": postEvStationData.value.command, "payload": validPayload })
    }


}

const tableHeader = [t('shift'), t('stepNum'), t('station'), t('group'), 'E.V.', t('status'), t('hour'), t('minute'), t('second'), "Volume", t('removeStep')]


</script>

<style scoped>
.button-wrapper {
    @apply mt-3 flex w-[100px] mx-auto
}

input[type=text], input[type=password], input[type=number] {
    @apply pl-2 rounded py-2 min-w-[30px] flex w-full
}

select {
    @apply pl-2 rounded py-2 min-w-[30px] cursor-pointer flex w-full
}

/* Table Style */
.table-container {
    @apply w-full relative h-[300px] sm:h-full overflow-scroll sm:overflow-visible
}

.table-container table {
    @apply mb-10 w-full
}


.table-container th {
    @apply font-semibold py-[10px] px-[10px] text-left sticky top-0 border-b-2 border-[#3a3a3e] bg-[#DDE8FA]/60 backdrop-blur-lg z-10
}

.table-container td {
    @apply py-[10px] px-[10px] bg-[#DDE8FA]/60 backdrop-blur-lg
}

.table-container th, td {
    @apply text-[10px] md:text-[16px]
}

.table-container tr {
    @apply text-left
}

.program-bar {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    /*justify-content: flex-start;*/
    align-items: center;
    gap: 10px;
}

.search-bar {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 90%;
    align-items: center;
}

.button-bar {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    align-items: center;
    justify-content: space-between;
}


.label-bar {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    /*align-content: center;*/
    justify-content: flex-start;
    align-items: center;
}

.w-50 {
    width: 50%;
}

.w-30 {
    width: 30%;
}

/* .w-40{
    width: 40%;
    min-width: 100px;
  } */

.w-15 {
    width: 20%;
}

.w-05 {
    width: 5%;
}

.w-05 select {
    min-width: 60px;
}

.w-10 {
    width: 10%;
}

.w-20 {
    width: 20%;
}

input[type=number].w-50 {
    width: 50%;
}

.mlw-20 {
    margin-left: 1.5rem;
    width: 20%;
}

.mrw-20 {
    margin-right: 1.5rem;
    width: 20%;
}


.mlw-30 {
    margin-left: 1.5rem;
    width: 30%;
}

.mrw-30 {
    margin-right: 1.5rem;
    width: 30%;
}

.hlight {
    font-weight: bold;
    margin-left: 10px;
    margin-right: 10px;
}


.mp-div {
    display: flex;
    flex-direction: row;
    align-content: space-around;
    width: 100%;
    margin: auto;
    align-items: center;
    /* justify-items: stretch; */
    flex-wrap: wrap;
    padding: 0;
    justify-content: flex-start;
}

.index {
    text-align: left;
    width: 1.25rem;
}

.ev-list {
    display: flex;
    flex-direction: column;
    text-align: left;
}

.container-mp {
    margin: auto;
}

/*.table-container th*/
.table-container td {
    backdrop-filter: none;
}

.centered {
    text-align: center;
}

.lefted {
    text-align: left;
}

.table-container th {
    /*background-color: rgb(221 232 250);*/
}

.table-container tr {
    border-bottom: 1px solid black;
}

.filled_green {
    background-color: #0fdd13;
    border: 1px solid #0fdd13;
    color: black;
}


:hover.filled_green {
    background-color: #038605;

    color: black;
}

.mp-button {
    padding-top: .5rem;
    padding-bottom: .5rem;
    border-radius: 5px;
    font-weight: 400;
}

.no-margin {
    margin: unset;
}

.blink_yellow {
    animation: .5s blinker linear infinite;
    -webkit-animation: .5s blinker linear infinite;
    -moz-animation: .5s blinker linear infinite;
    color: rgb(251, 255, 0);
}

.blink_green {
    animation: .5s blinker linear 5;
    -webkit-animation: .5s blinker linear 5;
    -moz-animation: .5s blinker linear 5;
    color: rgb(9, 255, 0);
}

@-moz-keyframes blinker {
    0% {
        opacity: 1.0;
    }

    50% {
        opacity: 0.0;
    }

    100% {
        opacity: 1.0;
    }
}

@-webkit-keyframes blinker {
    0% {
        opacity: 1.0;
    }

    50% {
        opacity: 0.0;
    }

    100% {
        opacity: 1.0;
    }
}

@keyframes blinker {
    0% {
        opacity: 1.0;
    }

    50% {
        opacity: 0.0;
    }

    100% {
        opacity: 1.0;
    }
}
</style>