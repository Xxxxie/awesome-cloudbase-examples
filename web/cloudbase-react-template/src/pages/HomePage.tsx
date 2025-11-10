import { motion } from "framer-motion";
import { Cloud, Palette, Rocket } from "lucide-react";

const UPDATE_ENV_ID = `// src/utils/cloudbase.js

const ENV_ID = 'your-env-id';`;

const ADD_NEW_PAGE = `// src/App.jsx

<Route path="/new-page" element={<NewPage />} />`;

const USE_CLOUDBASE = `import cloudbase from './utils/cloudbase';

// 确保登录
await cloudbase.ensureLogin();

// 使用数据库
const db = cloudbase.app.database();`;

const HomePage = () => {
  const features = [
    {
      title: "前端框架",
      description: "React 18 + Vite + React Router 6",
      icon: <Rocket className="h-10 w-10" />,
    },
    {
      title: "样式方案",
      description: "Tailwind CSS + DaisyUI",
      icon: <Palette className="h-10 w-10" />,
    },
    {
      title: "云开发能力",
      description: "数据库、云函数、云存储",
      icon: <Cloud className="h-10 w-10" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
          CloudBase React 模板
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-80">
          快速开始构建集成了腾讯云开发能力的现代化 React 应用
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1"
        >
          <div className="card bg-base-200 shadow-xl h-full">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">🚀 开始使用</h2>
              <div className="space-y-4 text-left">
                <div className="p-4 bg-base-300 rounded-lg">
                  <p className="font-mono text-sm">1. 修改环境 ID</p>
                  <code className="block mt-2 p-2 bg-base-100 rounded text-xs whitespace-pre-wrap">
                    {UPDATE_ENV_ID}
                  </code>
                </div>
                <div className="p-4 bg-base-300 rounded-lg">
                  <p className="font-mono text-sm">2. 添加新页面</p>
                  <code className="block mt-2 p-2 bg-base-100 rounded text-xs whitespace-pre-wrap">
                    {ADD_NEW_PAGE}
                  </code>
                </div>
                <div className="p-4 bg-base-300 rounded-lg">
                  <p className="font-mono text-sm">3. 使用云开发</p>
                  <code className="block mt-2 p-2 bg-base-100 rounded text-xs whitespace-pre-wrap">
                    {USE_CLOUDBASE}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex-1"
        >
          <div className="card bg-base-200 shadow-xl h-full">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">✨ 核心特性</h2>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="text-primary">{feature.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg">{feature.title}</h3>
                      <p className="opacity-80">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-center gap-4 mt-8"
      >
        <a
          href="https://docs.cloudbase.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          查看文档
        </a>
        <a
          href="https://github.com/TencentCloudBase/cloudbase-templates"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          更多模板
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-16 p-4 bg-base-200 rounded-lg text-center"
      >
        <p className="opacity-60 text-sm">
          当前环境 ID: {import.meta.env.VITE_ENV_ID || "未设置"} |
          <a
            href="https://console.cloud.tencent.com/tcb"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 underline"
          >
            管理控制台
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default HomePage;
