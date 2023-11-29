<template>
  <div class="container mx-auto p-4" style="min-height: calc(100% - 200px)">
    <v-row class="mb-1">
      <v-col cols="10">
        <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            placeholder="Type here to filter..."
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

    <v-row>
      <v-col class="flex justify-left items-center" cols="4">
        <v-pagination
            size="small"
            v-model="pagination.page"
            :length="pagination.totalPages"
            color="primary"
            @input="pagination.page = $event"
            total-visible="3"
            variant="outlined"
        ></v-pagination>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="2" class="text-right text-sm py-6">
        <p>Filtered Items: {{instSets.length}}</p>
        <p>Total Items: {{rawInstSets.length}}</p>
      </v-col>
    </v-row>

    <!-- Product Grid -->
    <div class="ma-3">
      <v-row>
        <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            v-for="instSet in pagedInstSets"
            :key="instSet.id"
            v-if="instSets.length > 0"
        >
          <v-card class="elevation-0 pa-2" outlined variant="outlined">
            <v-card-title class="headline">
              <v-row>
                <v-col class="py-4">ID: {{ instSet.id.toUpperCase() }}</v-col>
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

            <v-card-actions>
              <v-row>
                <v-col fixed>
                  <v-btn variant="outlined" @click="copyInstSet(instSet.id)" class="ml-3" icon="mdi-content-copy" color="green" size="small" />
                  <NuxtLink :to="`/editor/${instSet.id}`">
                    <v-btn variant="outlined" class="ml-3" icon="mdi-file-edit" size="small"></v-btn>
                  </NuxtLink>
                  <v-btn variant="outlined" @click="deleteInstSet(instSet.id)" class="ml-3" icon="mdi-delete" color="red" size="small" />
                </v-col>
              </v-row>
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
  </div>

  <DialogBox ref="dialogBoxRef" />

</template>

<script setup lang="ts">
import {computed} from 'vue';
import type {InstructionSet} from "~/models/instruction";
import JsonFormat from 'json-format'
import Fuse from "fuse.js";

const router = useRouter()

// States
const rawInstSets = ref([] as InstructionSet[])
const fuseIndex = computed(() => {
  return new Fuse(rawInstSets.value || [], {
    includeScore: true,
    keys: ['id', 'tags'],
    isCaseSensitive: false,
    findAllMatches: false,
  })
})
const searchQuery = ref('')
const instSets = computed(() => {
  if (searchQuery.value.trim() === '') {
    return rawInstSets.value as unknown as InstructionSet[]
  }
  return fuseIndex.value.search(searchQuery.value).map(result => result.item) as InstructionSet[]
})
const dialogBoxRef = ref<any>(null)
const pagination = reactive({
  page: 1,
  totalPages: 1,
  itemsPerPage: 12,
})

const pagedInstSets = computed(() => {
  return instSets.value.slice((pagination.page - 1) * pagination.itemsPerPage, pagination.page * pagination.itemsPerPage)
})

watchEffect(() => {
  pagination.totalPages = Math.ceil(instSets.value.length / pagination.itemsPerPage)
  if (pagination.page > pagination.totalPages) {
    if (pagination.totalPages === 0) {
      pagination.page = 1
    } else {
      pagination.page = pagination.totalPages
    }
  }
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
  if (await dialogBoxRef.value?.openDialog()) {
    await $fetch(`/api/inst-set/${id}`, {method: 'DELETE'})
    await fetchInstSets()
  }
}

async function copyInstSet(id: string) {
  await router.push({
    path: `/editor`,
    query: {
      copiedFrom: id
    }
  })
}

</script>


<style scoped>
.text-gray {
  color: #aaaaaa;
}
</style>
