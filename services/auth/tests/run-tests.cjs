const { readdir } = require("node:fs/promises");
const { join } = require("node:path");
const { pathToFileURL } = require("node:url");

async function runAllTests() {
  const testDirectory = __dirname;
  const testFiles = (await readdir(testDirectory))
    .filter((file) => file.endsWith(".test.ts"))
    .sort();

  for (const file of testFiles) {
    await import(pathToFileURL(join(testDirectory, file)).href);
  }
}

runAllTests().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
