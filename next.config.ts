import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 쪽이 1,633개로 늘어 이 PC(창 여러 개가 동시에 돌아감)에서 기본 60초 제한에 걸렸다.
  // 숫자·내용은 그대로이고 쪽 하나를 굽는 시간 여유만 늘린다.
  // 빌드는 CI=1 로 돌린다 — Next 16.4.4 는 보안 업데이트를 묻는 대화창을 띄워 그대로 멈춘다.
  staticPageGenerationTimeout: 300,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
