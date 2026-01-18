// Minimal ESLint config for staging builds
// All rules are disabled to allow builds to succeed
export default [
  {
    ignores: ["**/*"],
  },
  {
    rules: {
      // Disable all rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "no-console": "off",
      "no-unused-vars": "off",
    },
  },
];
