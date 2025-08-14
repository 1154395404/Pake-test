#!/usr/bin/env node

/**
 * Main Test Runner for Pake CLI
 *
 * This is the entry point for running all tests.
 * Usage: node tests/index.js [--unit] [--integration] [--builder] [--e2e] [--full]
 *
 * By default, runs all tests including E2E packaging tests.
 * Use specific flags to run only certain test suites.
 */

import cliTestRunner from "./cli.test.js";
import integrationTestRunner from "./integration.test.js";
import builderTestRunner from "./builder.test.js";
import e2eTestRunner from "./e2e.test.js";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import ora from "ora";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.dirname(__dirname);
const cliPath = path.join(projectRoot, "dist/cli.js");

const args = process.argv.slice(2);
const runUnit = args.length === 0 || args.includes("--unit");
const runIntegration = args.length === 0 || args.includes("--integration");
const runBuilder = args.length === 0 || args.includes("--builder");
const runE2E =
  args.length === 0 || args.includes("--e2e") || args.includes("--full");

async function runAllTests() {
  console.log("🚀 Pake CLI Test Suite");
  console.log("=======================\n");

  let totalPassed = 0;
  let totalTests = 0;

  if (runUnit) {
    console.log("📋 Running Unit Tests...\n");
    await cliTestRunner.runAll();
    totalPassed += cliTestRunner.results.filter((r) => r.passed).length;
    totalTests += cliTestRunner.results.length;
    console.log("");
  }

  if (runIntegration) {
    console.log("🔧 Running Integration Tests...\n");
    await integrationTestRunner.runAll();
    totalPassed += integrationTestRunner.results.filter((r) => r.passed).length;
    totalTests += integrationTestRunner.results.length;
    console.log("");
  }

  if (runBuilder) {
    console.log("🏗️  Running Builder Tests...\n");
    await builderTestRunner.runAll();
    totalPassed += builderTestRunner.results.filter((r) => r.passed).length;
    totalTests += builderTestRunner.results.length;
    console.log("");
  }

  if (runE2E) {
    console.log("🚀 Running End-to-End Tests...\n");
    await e2eTestRunner.runAll();
    totalPassed += e2eTestRunner.results.filter((r) => r.passed).length;
    totalTests += e2eTestRunner.results.length;
    console.log("");
  }

  // Final summary
  console.log("🎯 Overall Test Summary");
  console.log("=======================");
  console.log(`Total: ${totalPassed}/${totalTests} tests passed`);

  if (totalPassed === totalTests) {
    console.log("🎉 All tests passed! CLI is ready for use.\n");
  } else {
    console.log(
      `❌ ${totalTests - totalPassed} test(s) failed. Please check the issues above.\n`,
    );
  }

  // Exit with appropriate code
  process.exit(totalPassed === totalTests ? 0 : 1);
}

runAllTests().catch((error) => {
  console.error("❌ Test runner failed:", error);
  process.exit(1);
});
