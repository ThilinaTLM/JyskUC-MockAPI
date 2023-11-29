<script setup lang="ts">

export interface DialogResult {
  resolve: (value: any) => void
  reject: (value: any) => void
}

const dialogPromise = ref<DialogResult | null>(null)
const isOpen = ref(false)


const openDialog = async () => {
  return new Promise((resolve, reject) => {
    isOpen.value = true
    dialogPromise.value = {
      resolve,
      reject
    }
  })
}

const closeDialog = (value: boolean) => {
  isOpen.value = false
  if (dialogPromise.value) {
    dialogPromise.value?.resolve(value)
    dialogPromise.value = null
  }
}

watchEffect(() => {
  if (isOpen.value == false && dialogPromise.value) {
    closeDialog(false)
  }
})

defineExpose({
  openDialog,
  closeDialog
})

</script>

<template>
  <v-dialog width="300" height="300" v-model="isOpen">
    <template v-slot:default="{ isActive: isOpen }">
      <v-card title="Confirmation" class="pa-3">
        <v-card-text>
          Are you sure?
        </v-card-text>

        <v-card-actions class="px-3">


          <v-btn color="error" variant="tonal" @click="closeDialog(true)">
            Yes
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="success" variant="tonal" @click="closeDialog(false)">
            No
          </v-btn>

        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>


