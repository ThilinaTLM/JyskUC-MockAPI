<template>
  <div class="container mx-auto p-4 h-screen">
    <v-row class="mb-1">
      <v-col cols="12">
        <h5 class="text-2xl font-light">Pos Instruction Sets</h5>
      </v-col>
    </v-row>

    <v-row class="mb-1">
      <v-col cols="12" class="text-right">
        <v-spacer></v-spacer>
        <NuxtLink :to="`/editor`">
          <v-btn color="primary" variant="elevated">
            Create New
          </v-btn>
        </NuxtLink>
      </v-col>
    </v-row>

    <!-- Search Box -->
    <v-text-field
        v-model="state.search"
        append-inner-icon="mdi-magnify"
        label="Search for instruction sets"
        single-line
        hide-details
        variant="outlined"
    ></v-text-field>

    <!-- Product Grid -->
    <div>
      <v-row>
        <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            v-for="instSet in filteredInstSets"
            :key="instSet.id"
            v-if="filteredInstSets.length > 0"
        >
          <v-card class="elevation-2 my-5 mx-1" outlined>
            <v-card-title class="headline bg-blue">
              {{ instSet.id.toUpperCase() }}
            </v-card-title>
            <v-card-subtitle class="grey--text text--darken-1 my-3">
              {{ instSet.name }}
            </v-card-subtitle>
            <v-card-text class="px-7">
              <v-row class="mb-4">
                {{ instSet.description }}
              </v-row>
              <v-row>
                <v-chip
                    v-for="tag in instSet.tags"
                    :key="tag"
                    class="mr-1"
                    color="primary"
                >
                  {{ tag }}
                </v-chip>
              </v-row>
            </v-card-text>

            <v-card-actions>
                  <v-divider></v-divider>
                  <NuxtLink :to="`/editor/${instSet.id}`">
                    <v-btn variant="outlined" class="ml-3">
                      Edit
                    </v-btn>
                  </NuxtLink>
                  <v-btn variant="outlined" @click="deleteInstSet(instSet.id)" class="ml-3">
                    Delete
                  </v-btn>
            </v-card-actions>
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

    <!-- Pagination -->
    <v-pagination
        v-model="state.page"
        :length="totalPages"
        circle
    ></v-pagination>
  </div>
</template>

<script setup lang="ts">
import {computed, reactive} from 'vue';
import type {InstructionSet} from "~/models/instruction";

// Define a reactive state
const state = reactive({
  search: '',
  page: 1,
  pageSize: 8,
  instSets: [] as InstructionSet[],
});
await fetchInstSets()

// Computed property for filtered products
const filteredInstSets = computed(() => {
  const start = (state.page - 1) * state.pageSize;
  const end = start + state.pageSize;
  return state.instSets
      .filter(product =>
          product.name.toLowerCase().includes(state.search.toLowerCase())
      )
      .slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(state.instSets.length / state.pageSize);
});


async function fetchInstSets() {
  state.instSets = await $fetch('/api/inst-set')
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
