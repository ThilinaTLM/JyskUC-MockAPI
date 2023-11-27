<template>
  <NuxtLayout>
    <v-app class="v-application">
      <v-app-bar :elevation="1" class="text-center bg-blue">
          <v-toolbar-title>
          <NuxtLink :to="`/`">
            <h2 class="text-white font-weight-bold">JYSK UC Mock API</h2>
          </NuxtLink>
          </v-toolbar-title>
      </v-app-bar>
      <v-main>
        <NuxtPage />
      </v-main>
    </v-app>
  </NuxtLayout>
</template>

v
<style scoped>
  .v-application {
    background-color: #ffffff;
  }
</style>
<script setup lang="ts">
</script>