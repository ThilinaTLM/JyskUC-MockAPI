<script setup lang="ts">
import {computed} from 'vue';
import type {InstructionSet} from "~/mongo/model";
import Fuse from "fuse.js";

const router = useRouter()

// States
const loading = ref(false)
const rawInstSets = ref([] as InstructionSet[])
const fuseIndex = computed(() => {
  return new Fuse(rawInstSets.value || [], {
    includeScore: true,
    keys: [
      { name: 'id', weight: 0.5 },
      { name: 'tags', weight: 0.7 },
    ],
    isCaseSensitive: false,
    findAllMatches: false,
  })
})
const searchQuery = ref('')
const instSets = computed(() => {
  if (searchQuery.value.trim() === '') {
    const _set = rawInstSets.value as unknown as InstructionSet[]
    _set.sort((a, b) => {
      if (!a.modified || !b.modified) return 0
      if (a.modified > b.modified) return -1
      if (a.modified < b.modified) return 1
      return 0
    })
    return _set
  }
  return fuseIndex.value.search(searchQuery.value).map(result => result.item) as InstructionSet[]
})
const dialogBoxRef = ref<any>(null)
const pagination = reactive({
  page: 1,
  totalPages: 1,
  itemsPerPage: 24,
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
fetchInstSets()


// Functions
async function fetchInstSets() {
  loading.value = true
  rawInstSets.value = await $fetch('/api/inst-set')
  loading.value = false
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
          <v-btn color="primary" variant="outlined" :stacked="true" prepend-icon="mdi-book-plus" density="comfortable" class="w-full">
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
            total-visible="5"
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
      <v-row v-if="instSets.length > 0">
        <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            v-for="(instSet, index) in pagedInstSets"
            :key="index"
        >
          <InstSetCard
            :inst-set="instSet"
            @copyInstSet="copyInstSet"
            @deleteInstSet="deleteInstSet"
          />
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col v-if="loading" class="flex flex-col justify-center items-center w-full h-[500px]">
          <v-progress-circular
              indeterminate
              size="64"
              class="mb-2"
          ></v-progress-circular>
          <span class="text-lg font-semibold text-gray">
            Loading instruction sets...
          </span>
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




<style scoped>
.text-gray {
  color: #aaaaaa;
}
</style>
