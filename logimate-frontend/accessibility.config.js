const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');

async function runAccessibilityTests() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');

  const results = await new AxePuppeteer(page).analyze();

  console.log('Accessibility Violations:');
  results.violations.forEach(violation => {
    console.log(`- ${violation.id}: ${violation.description}`);
    console.log(`  Impact: ${violation.impact}`);
    console.log(`  Help: ${violation.help}`);
    console.log(`  Help URL: ${violation.helpUrl}`);
  });

  console.log('\nTotal Violations:', results.violations.length);
  console.log('Passes:', results.passes.length);

  await browser.close();
}

runAccessibilityTests();
