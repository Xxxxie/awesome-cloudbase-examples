<template>
  <header class="border-b border-base-300 bg-base-100">
    <nav class="container mx-auto px-4 py-4">
      <RouterLink to="/" class="text-xl font-semibold">
        <span class="text-primary">CloudBase + Vue</span>
      </RouterLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
