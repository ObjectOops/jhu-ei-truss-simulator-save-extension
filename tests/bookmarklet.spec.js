// @ts-check
const { test } = require('@playwright/test');
const fs = require('fs').promises;
const path = require('path');

const sharedTests = require('./shared');

const absolutePath = path.resolve(__dirname, '../client_generator/ei.jhu.edu/truss-simulator/index_original.html');
const bookmarkletPath = path.resolve(__dirname, 'bookmarklet.txt');

test.beforeEach(async ({ page }) => {
    page.on('dialog', sharedTests.dialogHandler);
    await page.goto(`file://${absolutePath}`);
    
    let bookmarkletContent = await fs.readFile(bookmarkletPath, 'utf8');
    await page.evaluate(bookmarkletContent => {
        let a = document.createElement('a');
        a.href = bookmarkletContent;
        a.id = 'bookmarkletEx';
        a.textContent = 'loadEx';
        document.body.appendChild(a);
    }, bookmarkletContent);
    await page.click('#bookmarkletEx');

    // @ts-ignore
    await page.waitForFunction(() => globalThis.loadOnce !== undefined && window.workspace !== undefined);

    page.on('console', msg => {
        console.log("CONSOLE " + msg.text());
    });
});

sharedTests.init();
