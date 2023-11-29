<template>
  <v-container>
    <v-form @submit.prevent="submitInstructionSet">
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
                  :prepend-inner-icon="idIsGenerated? 'mdi-new-box': 'mdi-lock'"
              ></v-text-field>
            </v-col>
            <v-col cols="8">
              <v-combobox
                  v-model="instructionSet.tags"
                  label="Tags"
                  placeholder="JYSK-2344"
                  hint="Write and press enter to add a tag"
                  variant="outlined"
                  chips
                  multiple
              ></v-combobox>
            </v-col>
          </v-row>
          <v-row>
            <v-slide-group
                show-arrows
            >
              <v-slide-group-item
                  v-for="(example, ind) in examples"
                  :key="ind"
                  v-slot="{ isSelected, toggle }"
              >
                <v-btn
                    class="px-3 ma-2"
                    rounded
                    size="small"
                    @click="appendToInstructions(example.instructions)"
                    variant="tonal"
                    color="primary"
                >
                  {{ example.name }}
                </v-btn>
              </v-slide-group-item>
            </v-slide-group>
          </v-row>
          <v-row>
            <v-col cols="12">
              <CodeEditor v-model:code="instructionSet.instructions"/>
            </v-col>
          </v-row>
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
import type {InstructionSet} from "~/models/instruction";
import jsonFormat from 'json-format'
import {generateRandomID} from "~/utils/generateId";
import examples from '~/utils/examples'

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
  const {copiedFrom} = router.currentRoute.value.query;
  if (copiedFrom) {
    const instSet: InstructionSet = await $fetch(`/api/inst-set/${copiedFrom}`);
    instructionSet.rawId = generateRandomID();
    instructionSet.tags = instSet.tags;
    instructionSet.instructions = jsonFormat(instSet.instructions);
    idIsGenerated.value = true
    return;
  } else {
    const {id} = router.currentRoute.value.params;
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
  instructionSet.tags = null;
  instructionSet.instructions = `[\n\t\n]`;
};

const submitInstructionSet = async () => {
  const formData = {
    id: id.value,
    tags: Object.values(instructionSet.tags || {}) || [],
    instructions: JSON.parse(instructionSet.instructions),
  };
  console.log("FORM-DATA", formData);
  await $fetch('/api/inst-set', {
    method: 'POST',
    body: formData
  })
  await router.push({
    path: '/'
  })
};

const appendToInstructions = (newInst: any) => {
  try {
    const sourceInst = JSON.parse(instructionSet.instructions) as any[];
    sourceInst.push(...newInst);
    instructionSet.instructions = jsonFormat(sourceInst);
  } catch (e) {
    alert("Invalid JSON")
  }
};
</script>