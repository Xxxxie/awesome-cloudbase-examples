<template>
  <div class="flex min-h-screen flex-col bg-base-200 text-base-content">
    <div
      v-if="isLoading"
      class="flex grow flex-col items-center justify-center px-4"
    >
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="mt-4 text-sm opacity-70">加载中...</p>
    </div>
    <template v-else>
      <AppNavbar />
      <main class="grow">
        <RouterView />
      </main>
      <AppFooter />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterView } from "vue-router";
import AppNavbar from "./components/AppNavbar.vue";
import AppFooter from "./components/HomeFooter.vue";
import { ensureLogin } from "./utils/cloudbase.js";

const isLoading = ref(true);

onMounted(async () => {
  try {
    console.log("开始登录...");
    await ensureLogin();
    console.log("登录成功");
  } catch (error) {
    console.error("登录失败", error);
  } finally {
    isLoading.value = false;
  }
});
</script>
