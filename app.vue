<script setup lang="ts">
const router = useRouter()
useHead({
  title: 'JYSK UC Mock API'
})
</script>

<template>
  <NuxtLayout>
    <v-app class="v-application">
      <v-app-bar :elevation="0">
        <v-btn
            color="primary"
            @click="() => router.back()"
            variant="outlined"
            icon="mdi-arrow-left"
            density="comfortable"
        />
        <v-toolbar-title>

          <NuxtLink to="/">
            <h2 class="font-weight-medium text-primary">JYSK UC Mock API</h2>
          </NuxtLink>
        </v-toolbar-title>
      </v-app-bar>
      <v-main>
        <NuxtPage/>
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

