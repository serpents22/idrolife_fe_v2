<template>
    <draggable 
      :list="[value]"
      :group="cell"
      :itemKey="String(index)"
      :disabled="!isEditing || item.stazione == 0" 
      @start="startDrag"
      :move="onMobileMove"
      @end="onMobileEnd"
      tag="td"
      class="itemCell"
      :class="{canDrop, cannotDrop}"
      dragClass="itemCell"
      :data-cell-type="cell"
      :data-row="JSON.stringify(item)"
      :options="{ animation: 150 }"
    >
      <template #item="{element}">
        <span class="itemCell" :class="{canDrop, cannotDrop}" >
          {{ getFormattedItemCell(cell, element) }}
        </span>
      </template>
    </draggable>
  </template>
  
<script setup>
  import { computed } from 'vue';
import draggable from 'vuedraggable'
  
  const props = defineProps({
    cell: {
      type: String,
      required: true
    },
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    isEditing: {
      type: Boolean,
      required: true
    },
    getFormattedItemCell: {
      type: Function,
      required: true
    },
    getCellKey: {
      type: Function,
      required: true
    },
    draggedCellType: {
      type: String
    }
  })

  const emit = defineEmits(['start-drag', 'mobile-move', 'mobile-end'])
  const value = computed(() => props.item[props.getCellKey(props.cell)])
  const canDrop = computed(() => props.item.stazione > 0 && props.draggedCellType == props.cell)
  const cannotDrop = computed(() => props.item.stazione > 0 && ![props.cell, undefined].includes(props.draggedCellType))

  const startDrag = event => {
    const { cell, item: { stazione, id } } = props
    emit('start-drag', event, cell, stazione, value.value, id)
  }

  const onMobileMove = event => {
    emit('mobile-move', event)
    return false // needed to make target list hidden
  }

  const onMobileEnd = () => {
    emit('mobile-end')
  }
</script>