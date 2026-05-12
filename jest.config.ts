import type { Config } from 'jest';
import { createDefaultEsmPreset, pathsToModuleNameMapper } from 'ts-jest';
import JSON5 from 'json5';
import * as fs from "node:fs";

const preset = createDefaultEsmPreset({
  tsconfig: 'tsconfig.json',
});

const tsconfig = JSON5.parse(fs.readFileSync('./tsconfig.json', 'utf-8'));

const config: Config = {
  ...preset,
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  verbose: true,
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: "<rootDir>", useESM: true }) ?? {},
};

export default config;