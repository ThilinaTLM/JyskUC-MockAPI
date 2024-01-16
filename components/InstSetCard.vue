<script setup lang="ts">
import type {InstructionSet} from "~/mongo/model";
import {summarizedInstructions} from "~/utils/summarize";
import {jsonToHTML} from "../utils/json";

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
    console.log("Text copied to clipboard");
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
      <div class="action-item" v-for="(item, index) in summarizedInstructions(instSet.instructions)" :key="index">
        <v-tooltip>
          <template v-slot:activator="{ props }">
            <div class="attribute font-weight-bold bg-green-accent-1 text-black d-block">
              {{ item['Action'] }}
              <v-icon v-bind="props" class="cursor-pointer" size="xs">mdi-information-outline</v-icon>
            </div>
          </template>
          <span v-html="jsonToHTML(item.Raw)"></span>
        </v-tooltip>
        <span v-if="item['ItemID']" class="attribute text-success">{{ item['ItemID'] }}</span>
        <span v-if="item['Quantity']" class="attribute text-warning">Quantity: {{ item['Quantity'] }}</span>
        <span v-if="item['Price']" class="attribute text-grey-darken-2">Price: {{ item['Price'] }}</span>
        <span v-if="item['DeliveryType']" class="attribute text-grey-darken-2">{{ item['DeliveryType'] }}</span>
        <span v-if="item['Description']" class="attribute text-grey-darken-2">{{ item['Description'] }}</span>
        <span v-if="item['TenderID']" class="attribute text-grey-darken-2">{{ item['TenderID'] }}</span>
        <span v-if="item['Amount']" class="attribute text-grey-darken-2">Amount: {{ item['Amount'] }}</span>
        <span v-if="item['FirstName']" class="attribute text-grey-darken-2">{{ item['FirstName'] }}</span>
        <span v-if="item['LastName']" class="attribute text-grey-darken-2">{{ item['LastName'] }}</span>
        <span v-if="item['Email']" class="attribute text-grey-darken-2">{{ item['Email'] }}</span>
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

.action-item {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  margin-bottom: 7px;
  padding: 1px;
}

.action-item .attribute {
  margin-right: 5px;
  padding: 1px 3px;
  border-radius: 3px;
  font-size: 12px;
}

.scrollable {
  height: 200px;
  overflow: auto;
  scrollbar-width: none; /* For Firefox */
}

.scrollable::-webkit-scrollbar {
  display: none; /* For WebKit browsers */
}
</style>