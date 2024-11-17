const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouse() {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port
  };

  const runnerResult = await lighthouse('http://localhost:3000', options);
  
  // Log performance metrics
  const { categories } = runnerResult.lhr;
  console.log('Performance Score:', categories.performance.score * 100);
  console.log('Accessibility Score:', categories.accessibility.score * 100);
  console.log('Best Practices Score:', categories['best-practices'].score * 100);
  console.log('SEO Score:', categories.seo.score * 100);

  await chrome.kill();
}

runLighthouse();
