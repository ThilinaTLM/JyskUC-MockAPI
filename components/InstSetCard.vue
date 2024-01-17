<script setup lang="ts">
import type {InstructionSet} from "~/mongo/model";
import {summarizeInstructionSet} from "~/utils/instruction";
import {jsonToHTML} from "~/utils/json";
import jsonFormat from "json-format";

const {instSet}: { instSet: InstructionSet } = defineProps({
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
    console.log("Copied to clipboard");
    snackbar.value = true
  }).catch(err => {
    console.error('Could not copy text: ', err);
  });
}

</script>

<template>

  <div class="flex flex-col h-[375px] py-4 px-6 border-[1px] border-black rounded-md">
    <div class="text-md break-words text-wrap font-weight-bold flex-0">
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
    <div class="flex-0 text-sm mt-3 mb-3">
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
    <div class="flex-grow-1 scrollable h-auto">
      <div class="action-item" v-for="(item, index) in summarizeInstructionSet(instSet.instructions)" :key="index">
        <v-tooltip>
          <template v-slot:activator="{ props }">
            <div class="attribute-action font-weight-bold text-black d-block">
              {{ item.action }}
              <v-icon
                  v-bind="props"
                  @click="copyToClipboard(jsonFormat(item.raw, { type: 'space', size: 4 }))"
                  class="cursor-pointer"
                  size="xs"
              >
                mdi-content-copy
              </v-icon>
            </div>
          </template>
          <span class="code" v-html="jsonToHTML(item.raw)"></span>
        </v-tooltip>
        <span v-for="(tag, index) in item.extraInfo" class="attribute" :key="index" :style="`color: ${tag.color || 'inherit'}`">
          {{ `${tag.name}:${tag.value}`.replace(/^:/, '') }}
        </span>
      </div>
    </div>
    <div class="flex-0 mt-3">
      <v-row>
        <v-col fixed>
          <NuxtLink :to="`/editor/${instSet.id}`" class="mr-3">
            <v-btn variant="outlined" icon="mdi-file-edit" size="small"></v-btn>
          </NuxtLink>
          <v-btn variant="outlined" @click="emitCopyInstSet(instSet.id)" class="mr-3" icon="mdi-content-copy"
                 color="green" size="small"/>
          <v-btn variant="outlined" @click="emitDeleteInstSet(instSet.id)" class="mr-3" icon="mdi-delete" color="red"
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
      location="bottom right"
  >
    <v-icon left>mdi-check</v-icon>
    Copied to clipboard
  </v-snackbar>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  height: 375px;
}

.action-item {
  font-family: 'Fira Code', monospace;
  margin-bottom: 3px;
  padding: 5px 1px;
  border: 1px dashed #e2e8f0;
  background-color: #fafafa;
  border-radius: 3px;
}

.action-item .attribute {
  margin-right: 5px;
  padding: 0 3px;
  font-size: 10px;
}

.action-item .attribute-action {
  margin-right: 5px;
  padding: 0 3px;
  font-size: 12px;
}

.scrollable {
  height: 200px;
  overflow: auto;
  scrollbar-width: none;
}

.scrollable::-webkit-scrollbar {
  display: none;
}

.code {
  font-family: 'Fira Code', monospace;
  font-size: 8pt;
  line-height: 1.0 !important;
}
</style>