<script setup>
import {basicSetup, EditorView} from "codemirror"
import {json} from "@codemirror/lang-json"
import {Codemirror} from "vue-codemirror";

const props = defineProps(['code'])
const emit = defineEmits(['update:code'])

const sourceCode = computed({
  get() {
    return props.code
  },
  set(value) {
    emit('update:code', sourceCode)
  }
})

const extensions = [
  basicSetup,
  json(),
  EditorView.updateListener.of(update => {
    console.log("Update!", update)
  })
]
const view = shallowRef()
const handleReady = (payload) => {
  view.value = payload.view
}

</script>

<template>
  <Codemirror
      v-model="sourceCode"
      placeholder="List of instructions in JSON format"
      style="height: 550px; border: 1px solid #ccc; border-radius: 4px; font-family: 'Fira Code', monospace;"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @ready="handleReady"
  />
</template>