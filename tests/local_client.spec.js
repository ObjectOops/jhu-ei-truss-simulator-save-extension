// @ts-check
const { test } = require('@playwright/test');
const path = require('path');

const sharedTests = require('./shared')

const absolutePath = path.resolve(__dirname, '../client_generator/ei.jhu.edu/truss-simulator/index.html');

test.beforeEach(async ({ page }) => {
    page.on('dialog', sharedTests.dialogHandler);
    await page.goto(`file://${absolutePath}`);
    // @ts-ignore
    await page.waitForFunction(() => globalThis.loadOnce !== undefined && window.workspace !== undefined);

    page.on('console', msg => {
        console.log("CONSOLE " + msg.text());
    });
});

sharedTests.init();
