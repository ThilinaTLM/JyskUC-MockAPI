<template>
  <v-container>
    <v-form>
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
          label="Tags (Press enter to add a tag)"
          variant="outlined"
          density="comfortable"
          chips
          multiple
      ></v-combobox>

      <v-textarea
          v-model="instructionSet.instructions"
          label="Instructions (JSON format)"
          variant="outlined"
      ></v-textarea>

      <v-btn color="primary" @click="submitInstructionSet">Submit</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
const router = useRouter()

const instructionSet = reactive({
  rawId: "",
  name: "",
  description: "",
  tags: null,
  instructions: ""
});

const id = computed({
  get: () => instructionSet.rawId,
  set: (value) => {
    instructionSet.rawId = value.toUpperCase();
  }
});

const submitInstructionSet = async () => {
  const formData = {
    id: id.value,
    name: instructionSet.name,
    description: instructionSet.description,
    tags: Object.values(instructionSet.tags || {}) || [],
    instructions: instructionSet.instructions,
    created: new Date().toISOString(),
    modified: new Date().toISOString()
  };
  console.log(formData);
  // await $fetch('/api/inst-set', {
  //   method: 'POST',
  //   body: JSON.stringify(formData)
  // })
  // await router.push('/')
};
</script>