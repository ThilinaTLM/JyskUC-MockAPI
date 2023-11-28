<template>
  <v-container>
    <v-form @submit.prevent="submitInstructionSet" >
      <v-card
        title="Create Instruction Set"
        subtitle="Create a new instruction set"
        elevation="0"
      >
        <v-card-text>

          <v-row>
            <v-col cols="4">
              <v-text-field
                  v-model="id"
                  :label="idIsGenerated? 'Generated ID': 'ID'"
                  variant="outlined"
                  :rules="rules.id"
              ></v-text-field>
            </v-col>
            <v-col cols="8">
              <v-combobox
                  v-model="instructionSet.tags"
                  chips
                  label="Tags"
                  placeholder="JYSK-2344"
                  hint="Write and press enter to add a tag"
                  multiple
                  variant="outlined"
              ></v-combobox>
            </v-col>
          </v-row>
          <div class="pt-1">
            <div>
              <codemirror
                  v-model="instructionSet.instructions"
                  placeholder="List of instructions in JSON format"
                  style="height: 550px; border: 1px solid #ccc; border-radius: 4px"
                  :autofocus="true"
                  :indent-with-tab="true"
                  :tab-size="2"
                  :extensions="extensions"
                  @ready="handleReady"
              />
            </div>
          </div>
          <v-divider color="primary" class="my-2"></v-divider>
        </v-card-text>

        <v-card-actions class="mb-4 px-4">
          <v-btn
              color="error"
              @click="() => clear()"
              variant="outlined"
              prepend-icon="mdi-close"
              density="default"
              class="w-[120px]"
          >
            Clear
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              type="submit"
              variant="outlined"
              prepend-icon="mdi-content-save"
              density="default"
              class="w-[120px]"
              :disabled="instructionSet.rawId.trim() === ''"
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
import {json} from '@codemirror/lang-json'
import type {InstructionSet} from "~/models/instruction";
import jsonFormat from 'json-format'
import {generateRandomID} from "~/utils/generateId";

const extensions = [json()]
const view = shallowRef()
const handleReady = (payload) => {
  view.value = payload.view
}

const router = useRouter()

const idIsGenerated = ref(false)

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

// validation rules
const rules = {
  id: [
      value => !!value || 'Required.',
  ]
}

const prefetchInstructionSet = async () => {
  const { copiedFrom } = router.currentRoute.value.query;
  if (copiedFrom) {
    const instSet: InstructionSet = await $fetch(`/api/inst-set/${copiedFrom}`);
    instructionSet.rawId = generateRandomID();
    instructionSet.tags = instSet.tags;
    instructionSet.instructions = jsonFormat(instSet.instructions);
    idIsGenerated.value = true
    return;
  } else {
    const { id } = router.currentRoute.value.params;
    if (!id) return;

    const instSet: InstructionSet = await $fetch(`/api/inst-set/${id}`);
    instructionSet.rawId = instSet.id;
    instructionSet.tags = instSet.tags;
    instructionSet.instructions = jsonFormat(instSet.instructions);
  }
};
await prefetchInstructionSet()



const clear = () => {
  instructionSet.rawId = "";
  instructionSet.name = "";
  instructionSet.description = "";
  instructionSet.tags = null;
  instructionSet.instructions = `[\n\t\n]`;
};

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
