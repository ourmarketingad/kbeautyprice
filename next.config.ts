import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 쪽이 1,600개를 넘어 이 PC(여러 창이 동시에 돌아감)에서 기본 60초 제한에 걸렸다.
  // 숫자·내용은 바뀌지 않고 빌드 여유만 늘린다.
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
