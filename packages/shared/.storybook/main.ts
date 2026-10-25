import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { mergeConfig } from "vite";

const src = fileURLToPath(new URL("../src", import.meta.url));

/**
 * Storybook for the shared design system (`@super-app/shared`).
 *
 * Stories live in `packages/shared/stories` (outside `src`) so they are never
 * part of the `tsc -b` build output that the Next.js apps consume.
 * Components are imported from `src` directly, so Storybook does not need the
 * package to be built first.
 */
const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],

  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      // Tailwind v4 – same engine the apps use through @tailwindcss/postcss.
      plugins: [tailwindcss()],
      // Next.js inlines NEXT_PUBLIC_* at build time; Vite does not, and
      // `process` does not exist in the browser. Stories never call real APIs.
      define: {
        "process.env.NEXT_PUBLIC_API_URL": JSON.stringify(""),
        "process.env.NEXT_PUBLIC_API_HISTORY_URL": JSON.stringify(""),
      },
      resolve: {
        // The package resolves itself through its `exports` map (-> dist).
        // In Storybook we want the TypeScript sources instead.
        alias: [
          {
            find: /^@super-app\/shared\/assets\/(.*)$/,
            replacement: `${src}/assets/$1`,
          },
          {
            find: /^@super-app\/shared\/theme\/styles\/(.*)$/,
            replacement: `${src}/theme/styles/$1`,
          },
          {
            find: /^@super-app\/shared\/ui\/data-table$/,
            replacement: `${src}/ui/data-table/index.ts`,
          },
          {
            find: /^@super-app\/shared\/(theme|tenant|ui|lib|hooks)$/,
            replacement: `${src}/$1/index.ts`,
          },
          {
            find: /^@super-app\/shared$/,
            replacement: `${src}/index.ts`,
          },
        ],
      },
    });
  },
};

export default config;
