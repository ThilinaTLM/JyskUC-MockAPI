<template>
  <v-container>
    <v-form @submit="submitInstructionSet">
      <v-card
        title="Create Instruction Set"
        subtitle="Create a new instruction set"
        elevation="0"
      >
        <v-card-text>
          <v-text-field
              v-model="id"
              label="ID"
              variant="outlined"
              density="compact"
          ></v-text-field>

          <v-text-field
              v-model="instructionSet.name"
              label="Name"
              variant="outlined"
              density="comfortable"
          ></v-text-field>

          <v-textarea
              v-model="instructionSet.description"
              label="Description"
              variant="outlined"
              density="comfortable"
          ></v-textarea>

          <v-combobox
              v-model="instructionSet.tags"
              chips
              density="comfortable"
              label="Tags (Press enter to add a tag)"
              multiple
              variant="outlined"
          ></v-combobox>

          <div class="pt-3">
            <div>
              <v-label class="mb-1">Instructions (as a JSON array)</v-label>
            </div>
            <div>
              <codemirror
                  v-model="instructionSet.instructions"
                  placeholder="List of instructions in JSON format"
                  :style="{
                height: '500px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }"
                  :autofocus="true"
                  :indent-with-tab="true"
                  :tab-size="2"
                  :extensions="extensions"
                  @ready="handleReady"
              />
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="mb-4">
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              @click="() => router.back()"
              variant="elevated"
              class="mr-2 w-[150px]"
          >
            Back
          </v-btn>
          <v-btn
              color="primary"
              type="submit"
              variant="elevated"
              class="mr-2 w-[150px]"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import {Codemirror} from "vue-codemirror";
import { json } from '@codemirror/lang-json'
import type {InstructionSet} from "~/models/instruction";
import jsonFormat from 'json-format'

const extensions = [json()]
const view = shallowRef()
const handleReady = (payload) => {
  view.value = payload.view
}

const router = useRouter()

const instructionSet = reactive({
  rawId: "",
  name: "",
  description: "",
  tags: null as string[] | null,
  instructions: `[\n\t\n]`
});

const id = computed({
  get: () => instructionSet.rawId,
  set: (value) => {
    instructionSet.rawId = value.toUpperCase();
  }
});

const prefetchInstructionSet = async () => {
  const { id } = router.currentRoute.value.params;
  if (!id) return;

  const instSet: InstructionSet = await $fetch(`/api/inst-set/${id}`);
  instructionSet.rawId = instSet.id;
  instructionSet.name = instSet.name;
  instructionSet.description = instSet.description;
  instructionSet.tags = instSet.tags;
  instructionSet.instructions = jsonFormat(instSet.instructions);
};
await prefetchInstructionSet()

const submitInstructionSet = async () => {
  const formData = {
    id: id.value,
    name: instructionSet.name,
    description: instructionSet.description,
    tags: Object.values(instructionSet.tags || {}) || [],
    instructions: JSON.parse(instructionSet.instructions),
    created: new Date().toISOString(),
    modified: new Date().toISOString()
  };
  console.log("FORM-DATA", formData);
  await $fetch('/api/inst-set', {
    method: 'POST',
    body: JSON.stringify(formData)
  })
  await router.push({
    path: '/'
  })
};
</script>
