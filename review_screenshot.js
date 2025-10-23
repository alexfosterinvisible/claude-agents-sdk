const playwright = require('playwright');
const path = require('path');

(async () => {
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  const screenshotDir = '/Users/alex/Code3b/claude-agents-sdk/INDYDEVDAN/trees/68b7e9a5/agents/68b7e9a5/reviewer/review_img';

  try {
    console.log('Navigating to http://localhost:9205...');
    await page.goto('http://localhost:9205', { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for the app to load
    await page.waitForTimeout(3000);

    // Screenshot 1: Full application view
    console.log('Taking screenshot 1: Full application');
    await page.screenshot({
      path: path.join(screenshotDir, '01_full_application_interface.png'),
      fullPage: false
    });

    // Screenshot 2: Check if flowchart nodes are visible
    console.log('Taking screenshot 2: Flowchart nodes');
    const flowchartExists = await page.locator('.react-flow').count() > 0;
    if (flowchartExists) {
      await page.locator('.react-flow').first().screenshot({
        path: path.join(screenshotDir, '02_flowchart_canvas_with_nodes.png')
      });
    } else {
      console.log('React Flow canvas not found');
      await page.screenshot({
        path: path.join(screenshotDir, '02_flowchart_canvas_with_nodes.png'),
        fullPage: false
      });
    }

    // Screenshot 3: Check repository structure API response
    console.log('Taking screenshot 3: API test');
    await page.goto('http://localhost:9105/api/repo/structure?path=.', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(screenshotDir, '03_api_response_structure.png'),
      fullPage: false
    });

    // Screenshot 4: Back to main app - test layout
    console.log('Taking screenshot 4: Three column layout');
    await page.goto('http://localhost:9205', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(screenshotDir, '04_three_column_layout.png'),
      fullPage: true
    });

    console.log('Screenshots captured successfully!');
  } catch (error) {
    console.error('Error during screenshot capture:', error);
    await page.screenshot({
      path: path.join(screenshotDir, '99_error_state.png'),
      fullPage: true
    });
  } finally {
    await browser.close();
  }
})();
