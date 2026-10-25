# Shared package + Next.js on Windows

`@super-app/shared` is consumed by the Next.js apps through `transpilePackages`.
The shared package intentionally disables TypeScript JavaScript source maps and declaration maps.
This prevents Next/Turbopack from trying to read source-map targets while `tsc --watch` is rewriting
shared output, which can produce Windows `os error 32` file-lock failures.

After pulling changes, run from the repository root:

```bash
pnpm install
pnpm --filter @super-app/shared clean
pnpm --filter @super-app/shared build
pnpm dev:admin
```
