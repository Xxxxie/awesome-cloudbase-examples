<template>
  <div class="container mx-auto max-w-6xl px-4 py-16">
    <div class="mb-16 text-center">
      <h1 class="mb-4 text-4xl font-bold md:text-5xl">CloudBase Vue 模板</h1>
      <p class="mx-auto max-w-3xl text-lg opacity-80 md:text-xl">
        快速开始构建集成了腾讯云开发能力的现代化 Vue 应用
      </p>
    </div>

    <div class="mb-16 flex flex-col gap-8 md:flex-row">
      <div class="flex-1 transition duration-500">
        <div
          class="card h-full rounded-3xl border border-base-200 bg-base-100 shadow-lg"
        >
          <div class="card-body">
            <h2 class="card-title mb-4 text-2xl">🚀 开始使用</h2>
            <div class="space-y-4 text-left">
              <div class="rounded-2xl bg-base-200 p-4">
                <p class="font-mono text-sm">1. 修改环境 ID</p>
                <code
                  class="mt-2 block whitespace-pre-wrap rounded-xl bg-base-100 p-3 text-xs"
                >
                  {{ UPDATE_ENV_ID }}
                </code>
              </div>
              <div class="rounded-2xl bg-base-200 p-4">
                <p class="font-mono text-sm">2. 添加新页面</p>
                <code
                  class="mt-2 block whitespace-pre-wrap rounded-xl bg-base-100 p-3 text-xs"
                >
                  {{ ADD_NEW_PAGE }}
                </code>
              </div>
              <div class="rounded-2xl bg-base-200 p-4">
                <p class="font-mono text-sm">3. 使用云开发</p>
                <code
                  class="mt-2 block whitespace-pre-wrap rounded-xl bg-base-100 p-3 text-xs"
                >
                  {{ USE_CLOUDBASE }}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 transition duration-500 delay-200">
        <div
          class="card h-full rounded-3xl border border-base-200 bg-base-100 shadow-lg"
        >
          <div class="card-body">
            <h2 class="card-title mb-4 text-2xl">✨ 核心特性</h2>
            <div class="space-y-6">
              <div
                v-for="(feature, index) in features"
                :key="index"
                class="flex items-start gap-4 rounded-2xl bg-base-200/70 p-5"
              >
                <div class="text-primary">
                  <component :is="feature.icon" class="h-10 w-10" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold">{{ feature.title }}</h3>
                  <p class="opacity-80">{{ feature.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 flex flex-wrap justify-center gap-4">
      <a
        href="https://docs.cloudbase.net/"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-primary"
      >
        查看文档
      </a>
      <a
        href="https://github.com/TencentCloudBase/awesome-cloudbase-examples"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-outline"
      >
        更多模板
      </a>
    </div>

    <div
      class="mt-16 rounded-3xl border border-base-200 bg-base-100 p-4 text-center shadow-lg"
    >
      <p class="text-sm opacity-60">
        当前环境 ID: {{ environmentId }} |
        <a
          href="https://console.cloud.tencent.com/tcb"
          target="_blank"
          rel="noopener noreferrer"
          class="ml-1 underline"
        >
          管理控制台
        </a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  RocketLaunchIcon,
  SparklesIcon,
  CloudIcon,
} from "@heroicons/vue/24/outline";

const UPDATE_ENV_ID = `// src/utils/cloudbase.ts

export const ENV_ID = import.meta.env.VITE_ENV_ID || 'your-env-id';`;

const ADD_NEW_PAGE = `// src/main.ts

const routes = [
  { path: '/', component: HomePage },
  { path: '/new-page', component: NewPage },
];`;

const USE_CLOUDBASE = `import cloudbase from './utils/cloudbase';

// 确保登录
await cloudbase.ensureLogin();

// 使用数据库
const db = cloudbase.app.database();`;

const features = [
  {
    title: "前端框架",
    description: "Vue 3 + Vite + Vue Router 4",
    icon: RocketLaunchIcon,
  },
  {
    title: "样式方案",
    description: "Tailwind CSS + DaisyUI",
    icon: SparklesIcon,
  },
  {
    title: "云开发能力",
    description: "数据库、云函数、云存储",
    icon: CloudIcon,
  },
] as const;

const environmentId = computed(() => import.meta.env.VITE_ENV_ID || "未设置");
</script>
