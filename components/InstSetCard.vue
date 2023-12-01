<script setup lang="ts">
import JsonFormat from "json-format";
import type {InstructionSet} from "~/mongo/model";

const { instSet }: {instSet: InstructionSet} = defineProps({
  instSet: {
    type: Object,
    required: true,
  },
});

const snackbar = ref(false)

const emitEvents = defineEmits(['copyInstSet', 'deleteInstSet'])

const emitCopyInstSet = (id) => {
  emitEvents('copyInstSet', id)
}

const emitDeleteInstSet = (id) => {
  emitEvents('deleteInstSet', id)
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    console.log("Text copied to clipboard");
    snackbar.value = true
  }).catch(err => {
    console.error('Could not copy text: ', err);
  });
}

</script>

<template>

  <div class="flex flex-col h-[375px] py-4 px-6 border-[1px] border-black rounded-md">
      <div class="text-md break-words text-wrap font-weight-bold">
        <p>
          {{ instSet.id.toUpperCase() }}
          <v-btn
              class="inline-block"
              icon="mdi-content-copy"
              size="x-small"
              variant="text"
              @click="copyToClipboard(instSet.id)"
          />
        </p>
      </div>
      <div class="text-sm mt-3 mb-3">
        <v-chip
            v-for="tag in instSet.tags"
            :key="tag"
            class="mr-1 px-3"
            color="primary"
            variant="tonal"
            density="comfortable"
            size="sm"
        >
          {{ tag }}
        </v-chip>
      </div>
      <div class="flex-grow text-xs font-weight-light text-gray-500 break-words line-clamp-5 my-2" style="font-family: 'Fira Code', monospace">
        {{ JsonFormat(instSet.instructions) }}
      </div>
      <div class="mt-auto pt-3">
        <v-row>
          <v-col fixed>
            <v-btn variant="outlined" @click="emitCopyInstSet(instSet.id)" icon="mdi-content-copy"
                   color="green" size="small"/>
            <NuxtLink :to="`/editor/${instSet.id}`">
              <v-btn variant="outlined" class="ml-3" icon="mdi-file-edit" size="small"></v-btn>
            </NuxtLink>
            <v-btn variant="outlined" @click="emitDeleteInstSet(instSet.id)" class="ml-3" icon="mdi-delete" color="red"
                   size="small"/>
          </v-col>
        </v-row>
      </div>
  </div>

  <v-snackbar
      v-model="snackbar"
      :timeout="2000"
      variant="flat"
      position="relative"
  >
    Copied to clipboard
  </v-snackbar>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  height: 375px;
}
</style>