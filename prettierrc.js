module.exports = {
  // پرینت‌ها
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,

  // نقل قول‌ها
  singleQuote: true,
  jsxSingleQuote: false,

  // ویرگول‌ها
  trailingComma: "es5",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",

  // خطوط و فاصله‌ها
  endOfLine: "lf",
  semi: true,

  // تنظیمات ویژه
  overrides: [
    {
      files: ["*.json", "*.yml", "*.yaml"],
      options: {
        tabWidth: 2,
      },
    },
    {
      files: "*.css",
      options: {
        singleQuote: false,
      },
    },
  ],
};
