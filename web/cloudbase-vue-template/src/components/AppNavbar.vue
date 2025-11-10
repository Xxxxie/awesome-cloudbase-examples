<template>
  <header
    class="sticky top-0 z-30 border-b border-base-300 bg-base-100/90 backdrop-blur"
  >
    <nav class="navbar mx-auto max-w-6xl px-4">
      <div class="navbar-start">
        <div class="dropdown">
          <button
            type="button"
            tabindex="0"
            class="btn btn-ghost lg:hidden"
            aria-label="打开导航菜单"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <ul
            tabindex="0"
            class="menu dropdown-content mt-3 w-52 rounded-box border border-base-200 bg-base-100 p-2 shadow"
          >
            <li>
              <RouterLink :to="'/'" :class="{ active: route.path === '/' }">
                首页
              </RouterLink>
            </li>
            <!-- 可以在这里添加新的链接 -->
          </ul>
        </div>
        <RouterLink
          to="/"
          class="btn btn-ghost px-2 text-xl font-semibold normal-case"
        >
          <span class="text-primary">CloudBase + Vue</span>
        </RouterLink>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li>
            <RouterLink :to="'/'" :class="{ active: route.path === '/' }">
              首页
            </RouterLink>
          </li>
          <!-- 可以在这里添加新的链接 -->
        </ul>
      </div>
      <div class="navbar-end">
        <div class="dropdown dropdown-end">
          <button
            type="button"
            tabindex="0"
            class="btn btn-ghost btn-square"
            aria-label="切换主题"
          >
            <component :is="themeIcon" class="h-5 w-5" />
          </button>
          <ul
            class="menu menu-sm dropdown-content rounded-box border border-base-200 bg-base-100 shadow"
          >
            <li>
              <button
                type="button"
                :class="{ active: themePreference === 'light' }"
                @click="setTheme('light')"
                aria-label="切换到浅色模式"
              >
                <SunIcon class="h-4 w-4" />
              </button>
            </li>
            <li>
              <button
                type="button"
                :class="{ active: themePreference === 'dark' }"
                @click="setTheme('dark')"
                aria-label="切换到深色模式"
              >
                <MoonIcon class="h-4 w-4" />
              </button>
            </li>
            <li>
              <button
                type="button"
                :class="{ active: themePreference === 'system' }"
                @click="setTheme('system')"
                aria-label="切换到系统模式"
              >
                <ComputerDesktopIcon class="h-4 w-4" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/vue/24/outline";
import { useThemePreference } from "../composables/useThemePreference";

const route = useRoute();
const { themePreference, setThemePreference } = useThemePreference();

const themeIcon = computed(() => {
  if (themePreference.value === "light") {
    return SunIcon;
  }

  if (themePreference.value === "dark") {
    return MoonIcon;
  }

  return ComputerDesktopIcon;
});

const setTheme = (value: "light" | "dark" | "system") => {
  setThemePreference(value);
};
</script>
