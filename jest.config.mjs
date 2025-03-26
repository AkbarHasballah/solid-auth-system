/** @type {import('jest').Config} */
const config = {
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  coverageDirectory: "coverage",

  moduleFileExtensions: ["js", "mjs", "cjs", "jsx", "ts", "tsx", "json", "node"],
  
  // Tambahkan ekstensi .mjs ke testMatch
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)", "**/?(*.)+(spec|test).mjs"],

  // Biarkan kosong karena Jest sudah support native ESM
  transform: {},

  testEnvironment: "node",
};

export default config;
