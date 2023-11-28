<template>
  <div class="container mx-auto p-4" style="min-height: calc(100% - 200px)">
    <v-row class="mb-1">
      <v-col cols="10">
        <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            label="Search for instruction sets"
            variant="outlined"
            hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <NuxtLink to="/editor">
          <v-btn color="primary" variant="outlined" stacked prepend-icon="mdi-book-plus" density="comfortable" class="w-full">
            Create New
          </v-btn>
        </NuxtLink>
      </v-col>
    </v-row>

    <!-- Product Grid -->
    <div class="mt-4">
      <v-row>
        <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            v-for="instSet in instSets"
            :key="instSet.id"
            v-if="instSets.length > 0"
        >
          <v-card class="elevation-0 pa-2" outlined variant="outlined">
            <v-card-title class="headline">
              <v-row>
                <v-col class="py-4">ID: {{ instSet.id.toUpperCase() }}</v-col>
                <v-col class="text-right" fixed>
                  <v-btn variant="outlined" @click="deleteInstSet(instSet.id)" class="ml-3" icon="mdi-copy" color="red" size="small" />
                  <NuxtLink :to="`/editor/${instSet.id}`">
                    <v-btn variant="outlined" class="ml-3" icon="mdi-file-edit" size="small"></v-btn>
                  </NuxtLink>
                  <v-btn variant="outlined" @click="deleteInstSet(instSet.id)" class="ml-3" icon="mdi-delete" color="red" size="small" />
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-text class="px-7 mb-3 mt-6">
              <v-row class="mb-3">
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
              </v-row>
              <v-row class="h-[200px]">
                <p class="line-clamp-5">
                  {{ JsonFormat(instSet.instructions) }}
                </p>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col v-else class="flex flex-col justify-center items-center w-full h-[500px]">
          <v-icon size="64px" class="mb-3 text-gray">
            mdi-alert-circle-outline
          </v-icon>
          <span class="text-lg font-semibold text-gray">
            No instruction sets found.
          </span>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import type {InstructionSet} from "~/models/instruction";
import JsonFormat from 'json-format'
import Fuse from "fuse.js";

// States
const rawInstSets = ref([] as InstructionSet[])
const fuseIndex = computed(() => {
  return new Fuse(rawInstSets.value || [], {
    includeScore: true,
    keys: ['id', 'tags'],
    isCaseSensitive: false,
    findAllMatches: true,
  })
})
const searchQuery = ref('')
const instSets = computed(() => {
  if (searchQuery.value.trim() === '') {
    return rawInstSets.value as unknown as InstructionSet[]
  }
  return fuseIndex.value.search(searchQuery.value).map(result => result.item) as InstructionSet[]
})

// On Start
await fetchInstSets()


// Functions
async function fetchInstSets() {
  const data = await $fetch('/api/inst-set')
  console.log("ALL INSTRUCTION SETS", data.length)
  rawInstSets.value = data
}

async function deleteInstSet(id: string) {
  await $fetch(`/api/inst-set/${id}`, {method: 'DELETE'})
  await fetchInstSets()
}
</script>


<style scoped>
.text-gray {
  color: #aaaaaa;
}
</style>
