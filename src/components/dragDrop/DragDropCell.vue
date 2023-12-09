<template>
    <draggable 
      :list="[item.id]"
      :group="cell"
      :itemKey="String(index)"
      :disabled="!isEditing || item.stazione == 0" 
      @start="startDrag"
      :move="onMobileMove"
      @end="onMobileEnd"
      tag="td"
      class="itemCell"
      :class="{canDrop: item.stazione > 0 && draggedCellType == cell, cannotDrop: item.stazione > 0 && ![cell, undefined].includes(draggedCellType)}"
      dragClass="itemCell"
      :data-cell-type="cell"
      :data-row="JSON.stringify(item)"
      :options="{animation:150}"
    >
      <template #item="{element}">
        <span class="itemCell" :class="{canDrop: item.stazione > 0 && draggedCellType == cell, cannotDrop: item.stazione > 0 && ![cell, undefined].includes(draggedCellType)}" >
          {{ getFormattedItemCell(cell, element) }}
        </span>
      </template>
    </draggable>
  </template>
  
<script setup>
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
    draggedCellType: {
      type: String,
      required: true
    }
  })

  const emit = defineEmits(['start-drag', 'mobile-move', 'mobile-end'])

  const startDrag = event => {
    emit('start-drag', event)
  }

  const onMobileMove = event => {
    emit('mobile-move', event)
    return false
  }

  const onMobileEnd = () => {
    emit('mobile-end')
  }
</script>